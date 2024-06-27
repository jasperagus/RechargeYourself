var sendOSC = require('./osc.js');

let isPopupShown = false; 
var oscServer = new sendOSC();

// Welcome popup
window.onload = function() {
    toggleBlankSquarePopup("Welcome to 'Recharge Cocoon'! New click the top right video. Been before, click X and choose your session." , false, false); // Don't show questions on welcome popup
};

// Function to handle the play/pause button click
function handleButtonClick(songIndex) {
    const button = document.getElementById(`btn${songIndex}`);
    const isPlaying = button.dataset.isPlaying === "true";
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

    // Check if the seek bar reaches 0% and the popup is not shown
        if (newPosition === 0 && !isPopupShown) {
        toggleBlankSquarePopup("Song ended! How was your experience?", true, true); 
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

function submitForm() {
// Require Electron's remote module
const { remote } = require('electron');
const fs = remote.require('fs');
const path = require('path');
const form = document.getElementById('rechargeForm');
const formData = new FormData(form);

  // Prepare the values array for CSV content
const values = [];

  // Extract form field values into the values array
    formData.forEach((value) => {
    values.push(value);
});

  // gather which song was playing
const songIndex = document.getElementById('btnPlayPause').dataset.songIndex;
  // Add song number to values array
    values.push(songIndex); 

    // Add location to values array (location is hardcoded, change if needed)
    values.push("Breda1"); 

  // Add date and time to the values array
const time = new Date();
const formattedDate = `${time.getDate().toString().padStart(2, '0')}-${(time.getMonth() + 1).toString().padStart(2, '0')}-${time.getFullYear()}`;
const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

  // Add formatted date and time to values array
values.push(formattedDate, formattedTime); 

  // Join values array into a CSV row
const csvRow = values.join(',');

  // Determine the file path for saving
const filePath = 'C:\\Users\\Qub3zGamingL3\\Dropbox\\RechargeCocoon_test_jasper\\survey_results.csv';

  // Append the CSV row to the file
fs.appendFile(filePath, csvRow + '\n', (err) => {
    if (err) {
    console.error('Error appending to file:', err);
    return;
    }
    console.log('Data successfully appended to file:', filePath);
});

  // Reset the form
form.reset();

  // Close the popup
toggleBlankSquarePopup();

  // Reload the page
location.reload();
}

// Function to toggle the blank square popup
function toggleBlankSquarePopup(text, showQuestions, showWelcome) {
    const blankSquarePopup = document.getElementById("blankSquarePopup");
    const popupContent = blankSquarePopup.querySelector(".popupContent");
    const popupText = popupContent.querySelector("p");
    const welcomeMessage = popupContent.querySelector("#welcomeMessage"); // Select welcome message
    const submitButton = popupContent.querySelector(".submitButton");
    const questionsContainer = popupContent.querySelector(".questionsContainer");
    
    popupText.textContent = text; // Set the text content dynamically
    
    // Show or hide welcome message based on showWelcome parameter
    welcomeMessage.style.display = showWelcome ? "block" : "none";
    
    blankSquarePopup.style.display = blankSquarePopup.style.display === "block" ? "none" : "block";
    questionsContainer.style.display = showQuestions ? "block" : "none";
    submitButton.style.display = showQuestions ? "block" : "none"; // Hide or show the submit button
}
