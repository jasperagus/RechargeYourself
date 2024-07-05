var sendOSC = require('./osc.js');

let isPopupShown = false; 
var oscServer = new sendOSC();

// Welcome popup
window.onload = function() {
    toggleBlankSquarePopup(" ", false, true, true); // Show close button for welcome popup
};
// Function to handle the play/pause button click
function handleButtonClick(songIndex) {
    const button = document.getElementById(`btn${songIndex}`);
    const isPlaying = button.dataset.isPlaying === "true";

    // If a song is already playing, reset it to its original state
    const currentlyPlayingButton = document.querySelector('[data-is-playing="true"]');
    if (currentlyPlayingButton && currentlyPlayingButton.id !== button.id) {
        resetButtonStateAndColor(parseInt(currentlyPlayingButton.id.replace("btn", "")));
    }

    if (isPlaying) {
        oscServer.pause(true);
        updateButtonColor(songIndex, false);
    } else {
        oscServer.music(songIndex);
        oscServer.pause(false);
        // Change button color when the song starts playing
        updateButtonColor(songIndex, true);
    }
    button.dataset.isPlaying = !isPlaying;
}

// Function to update the button color and text based on the song index and playing state
function updateButtonColor(songIndex, isPlaying) {
    const songNames = [
        "Korte Relaxsessie - 12:15 min",
        "Diepe ontspanning - 26:14 min",
        "Meer rust in je hoofd - 20:49 min",
        "Beter slapen - 20:10 min",
        "Sublimale muzieksessie - 15:00 min",
        "Recharge sessie - 15:00 min",
        "Jezelf opladen - 16:31 min",
        "Loslaten negatieve emoties - 18.42 min",
        "Emotionele balans - 17.02 min",
        "Beter eetpatroon - 18:58 min"
    ];

    const button = document.getElementById(`btn${songIndex}`);
    if (isPlaying) {
        button.style.backgroundColor = "#ad9bb5";
        button.innerText = `${songIndex}. ${songNames[songIndex - 1]} - Playing`;

    } else {
        button.style.backgroundColor = "#b6b6b6";
        button.innerText = `${songIndex}. ${songNames[songIndex - 1]}`;
    }
}

// Add event listener to the song buttons
for (let i = 1; i <= 10; i++) {
    const button = document.getElementById(`btn${i}`);
    button.dataset.isPlaying = "false"; 
    button.addEventListener('click', () => {
        handleButtonClick(i);
    });
}

// Function to store the button number in the data attribute
function storeButtonClick(buttonId) {
    // Extract button number from buttonId
    const buttonNumber = buttonId.replace("btn", "");
    
    // Store button number in data attribute
    const btnPlayPause = document.getElementById('btnPlayPause');
    btnPlayPause.dataset.songIndex = buttonNumber;
}

// Function to update the seek position when the user changes the progress bar value
function updateSeekPosition() {
    const seekBar = document.getElementById("seekBar");
    const audioDuration = oscServer.sound.duration();
    const newPosition = parseInt(seekBar.value) / 100 * audioDuration;
    oscServer.sound.seek(newPosition);
}

// Add event listener to the seekBar input element
document.getElementById("seekBar").addEventListener("input", updateSeekPosition);

// Function to update the timer display
function updateTimerDisplay(currentTime) {
    const timerDisplay = document.getElementById("timerDisplay");
    timerDisplay.textContent = formatTime(currentTime);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(number) {
    return (number < 10 ? '0' : '') + number;
}

// Modify your setInterval function to update the timer display
setInterval(() => {
    const seekBar = document.getElementById("seekBar");
    const audioDuration = oscServer.sound.duration();
    const currentTime = oscServer.sound.seek();
    const newPosition = (currentTime / audioDuration) * 100;
    seekBar.value = newPosition; 
    updateBattery(currentTime, audioDuration);
    updateTimerDisplay(currentTime);

    // Check if the song has ended
    if (newPosition === 0 && !isPopupShown) {
        toggleBlankSquarePopup("", true, false, false); // Hide close button for question popup
        isPopupShown = true;

        // Reset button state and color for the currently playing song
        const playingButtonIndex = parseInt(document.querySelector('[data-is-playing="true"]').id.replace("btn", ""));
        resetButtonStateAndColor(playingButtonIndex);
    }
}, 1000); // Update every second

// Function to update the battery
function updateBattery(currentTime, audioDuration) {
    const battery = document.querySelector('.battery');
    const batteryBars = battery.querySelectorAll('.bar');
    const power = (currentTime / audioDuration) * 100;
    
    batteryBars.forEach((bar, index) => {
        if (index * 10 < power) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
}

// Function to reset button state and color for the given song index
function resetButtonStateAndColor(songIndex) {
    const button = document.getElementById(`btn${songIndex}`);
    button.dataset.isPlaying = "false";
    updateButtonColor(songIndex, false);
}

// Function to toggle the video player popup
function toggleVideoPopup() {
    const videoPopup = document.getElementById("videoPlayerPopup");
    videoPopup.style.display = videoPopup.style.display === "block" ? "none" : "block";
}

// Add event listener to the video player button
document.getElementById("videoPlayerButton").addEventListener('click', toggleVideoPopup);

// Add event listener to the top left button to toggle the blank square popup
document.getElementById("topLeftButton").addEventListener('click', toggleBlankSquarePopup);

// Function to submit the form
function submitForm() {
    const { remote } = require('electron');
    const fs = remote.require('fs');
    const path = require('path');
    const form = document.getElementById('rechargeForm');
    const formData = new FormData(form);

    const values = [];

    formData.forEach((value) => {
        values.push(value);
    });

    const songIndex = document.getElementById('btnPlayPause').dataset.songIndex;
    values.push(songIndex); 

    values.push("Breda1"); 

    const time = new Date();
    const formattedDate = `${time.getDate().toString().padStart(2, '0')}-${(time.getMonth() + 1).toString().padStart(2, '0')}-${time.getFullYear()}`;
    const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

    values.push(formattedDate, formattedTime); 

    const csvRow = values.join(',');

    const filePath = 'C:\\Users\\Qub3zGamingL3\\Dropbox\\RechargeCocoon_test_jasper\\survey_results.csv';

    fs.appendFile(filePath, csvRow + '\n', (err) => {
        if (err) {
            console.error('Error appending to file:', err);
            return;
        }
        console.log('Data successfully appended to file:', filePath);
    });

    form.reset();

    toggleBlankSquarePopup("", false, false, false);

    location.reload();
}

function toggleBlankSquarePopup(text, showQuestions, showWelcome, showCloseButton) {
    const blankSquarePopup = document.getElementById("blankSquarePopup");
    const popupContent = blankSquarePopup.querySelector(".popupContent");
    const popupText = popupContent.querySelector("p");
    const welcomeMessage = popupContent.querySelector("#welcomeMessage");
    const submitButton = popupContent.querySelector(".submitButton");
    const questionsContainer = popupContent.querySelector(".questionsContainer");
    const closeButton = popupContent.querySelector(".closeButton");
    
    popupText.textContent = text;
    
    welcomeMessage.style.display = showWelcome ? "block" : "none";
    closeButton.style.display = showCloseButton ? "block" : "none";    
    blankSquarePopup.style.display = blankSquarePopup.style.display === "block" ? "none" : "block";
    questionsContainer.style.display = showQuestions ? "block" : "none";
    submitButton.style.display = showQuestions ? "block" : "none";
}
