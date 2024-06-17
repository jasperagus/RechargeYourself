var sendOSC = require('./osc.js');

let isPopupShown = false; 
var oscServer = new sendOSC();

function handleButtonClick(songIndex) {
    const button = document.getElementById(`btn${songIndex}`);
    const isPlaying = button.dataset.isPlaying === "true";
    if (isPlaying) {
        oscServer.pause(true);
        
        // Reset button color when the song stops
        updateButtonColor(songIndex, false);
    } else {
        oscServer.music(songIndex);
        oscServer.pause(false);
        
        // Change button color when the song starts playing
        updateButtonColor(songIndex, true);
    }
    button.dataset.isPlaying = !isPlaying;
}

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
    button.dataset.isPlaying = "false"; // Initialize the data attribute
    button.addEventListener('click', () => {
        handleButtonClick(i);
    });
}

// Function to update the seek position when the user changes the progress bar value
function updateSeekPosition() {
    const seekBar = document.getElementById("seekBar");
    const audioDuration = oscServer.sound.duration();
    const newPosition = parseInt(seekBar.value) / 100 * audioDuration;
    oscServer.sound.seek(newPosition); // Seek to the new position in the audio file
}

// Add event listener to the seekBar input element
document.getElementById("seekBar").addEventListener("input", updateSeekPosition);

// Function to update the timer display
function updateTimerDisplay(currentTime) {
    const timerDisplay = document.getElementById("timerDisplay");
    timerDisplay.textContent = formatTime(currentTime);
}

// Modify your setInterval function to update the timer display
setInterval(() => {
    const seekBar = document.getElementById("seekBar");
    const audioDuration = oscServer.sound.duration();
    const currentTime = oscServer.sound.seek(); // Current playback time

    const newPosition = (currentTime / audioDuration) * 100; // Calculate percentage progress
    seekBar.value = newPosition; // Update the seek bar value
    updateBattery(currentTime, audioDuration);
    
    updateTimerDisplay(currentTime); // Update the timer display

    // Check if the seek bar reaches 100% or resets to 0%
    if (newPosition === 100) {
        // Pause the music when it reaches the end of the track
        oscServer.pause(true);
        // Show popup when seek bar is full
        //showPopup("Seek bar reached 100%!");
        
        // Reset button state and color for the currently playing song
        const playingButtonIndex = parseInt(document.querySelector('[data-is-playing="true"]').id.replace("btn", ""));
        resetButtonStateAndColor(playingButtonIndex);
    } else if (newPosition === 0 && !isPopupShown) {
        // Show popup only once when seek bar resets to 0%
        toggleBlankSquarePopup("Song ended! How was your experience?", true); // Call the function with the appropriate text and true to show questions
        isPopupShown = true; // Set flag to indicate popup has been shown

        // Reset button state and color for the currently playing song
        const playingButtonIndex = parseInt(document.querySelector('[data-is-playing="true"]').id.replace("btn", ""));
        resetButtonStateAndColor(playingButtonIndex);

        // Reset the app after the last popup is closed and show the welcome popup again
        setTimeout(() => {
        }, 5000); // Show welcome popup again after a delay (e.g., 5 seconds)
    }
}, 1000); // Update every second

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(number) {
    return (number < 10 ? '0' : '') + number;
}

// Function to reset button state and color for the given song index
function resetButtonStateAndColor(songIndex) {
    const button = document.getElementById(`btn${songIndex}`);
    button.dataset.isPlaying = "false";
    updateButtonColor(songIndex, false);
}

// Function to show popup
function showPopup(message) {
    // Replace this with your popup display logic
    alert(message);
}

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

// Function to toggle the video player popup
function toggleVideoPopup() {
    const videoPopup = document.getElementById("videoPlayerPopup");
    videoPopup.style.display = videoPopup.style.display === "block" ? "none" : "block";
}

// Add event listener to the video player button
document.getElementById("videoPlayerButton").addEventListener('click', toggleVideoPopup);

window.onload = function() {
    toggleBlankSquarePopup("Welcome to 'Recharge Cocoon'! New click the top right video. Been before, click X and choose your session." , false); // Don't show questions on welcome popup
};

// Add event listener to the top left button to toggle the blank square popup
document.getElementById("topLeftButton").addEventListener('click', toggleBlankSquarePopup);

function resetApp() {
    // Reset any necessary variables or states
    isPopupShown = false; // Reset popup flag
    oscServer.reset(); // Reset the OSC server
    // Reset any other app-specific states or variables
}

function toggleBlankSquarePopup(text, showQuestions) {
    const blankSquarePopup = document.getElementById("blankSquarePopup");
    const popupContent = blankSquarePopup.querySelector(".popupContent");
    const popupText = popupContent.querySelector("p");
    const submitButton = popupContent.querySelector(".submitButton");
    const questionsContainer = popupContent.querySelector(".questionsContainer");
    popupText.textContent = text; // Set the text content dynamically
    blankSquarePopup.style.display = blankSquarePopup.style.display === "block" ? "none" : "block";
    questionsContainer.style.display = showQuestions ? "block" : "none";
    submitButton.style.display = showQuestions ? "block" : "none"; // Hide or show the submit button
}
