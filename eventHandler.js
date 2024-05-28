var sendOSC = require('./osc.js');

let isPopupShown = false; 
var oscServer = new sendOSC();

function handleButtonClick(songIndex) {
    const button = document.getElementById(`btn${songIndex}`);
    const isPlaying = button.dataset.isPlaying === "true";
    if (isPlaying) {
        oscServer.pause(true);
    } else {
        oscServer.music(songIndex);
        oscServer.pause(false);
    }
    button.dataset.isPlaying = !isPlaying;
    updateButtonColor(songIndex, !isPlaying);
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

// Update the seek bar and battery periodically
setInterval(() => {
    const seekBar = document.getElementById("seekBar");
    const audioDuration = oscServer.sound.duration();
    const currentTime = oscServer.sound.seek();
    const newPosition = (currentTime / audioDuration) * 100; // Calculate percentage progress
    seekBar.value = newPosition; // Update the seek bar value
    updateBattery(currentTime, audioDuration);
    
    // Check if the seek bar reaches 100% or resets to 0%
    if (newPosition === 100) {
        // Pause the music when it reaches the end of the track
        oscServer.pause(true);
        // Show popup when seek bar is full
        showPopup("Seek bar reached 100%!");
    } else if (newPosition === 0 && !isPopupShown) {
        // Show popup only once when seek bar resets to 0%
        toggleBlankSquarePopup(" Song ended!");
        isPopupShown = true; // Set flag to indicate popup has been shown
    }
}, 1000); // Update every second

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

/*
// Function to toggle the music player popup
function togglePopup() {
    const popup = document.getElementById("musicPlayerPopup");
    popup.style.display = popup.style.display === "block" ? "none" : "block";
}

// Function to play a song from the popup
function playSong(songIndex) {
    oscServer.music(songIndex);
    togglePopup(); // Close the popup after selecting a song
}

// Function to toggle the video player popup
function toggleVideoPopup() {
    const videoPopup = document.getElementById("videoPlayerPopup");
    videoPopup.style.display = videoPopup.style.display === "block" ? "none" : "block";
}

// Add event listener to the video player button
document.getElementById("videoPlayerButton").addEventListener('click', toggleVideoPopup);



// Function to toggle the blank square popup with custom text
function toggleBlankSquarePopup(text = '') {
    const blankSquarePopup = document.getElementById("blankSquarePopup");
    const popupContent = blankSquarePopup.querySelector(".popupContent");
    const popupText = popupContent.querySelector("p");
    popupText.textContent = text; // Set the text content dynamically
    blankSquarePopup.style.display = blankSquarePopup.style.display === "block" ? "none" : "block";
}
*/

window.onload = function() {
    toggleBlankSquarePopup("Welcome user to 'Recharge Yourself'!");
};


// Add event listener to the top left button to toggle the blank square popup
document.getElementById("topLeftButton").addEventListener('click', toggleBlankSquarePopup);


// Function to toggle the blank square popup with custom text
function toggleBlankSquarePopup(text) {
    const blankSquarePopup = document.getElementById("blankSquarePopup");
    const popupContent = blankSquarePopup.querySelector(".popupContent");
    const popupText = popupContent.querySelector("p");
    popupText.textContent = text; // Set the text content dynamically
    blankSquarePopup.style.display = blankSquarePopup.style.display === "block" ? "none" : "block";
}

// Function to pause a song and display popup
function handleButtonClick(songIndex) {
    const button = document.getElementById(`btn${songIndex}`);
    const isPlaying = button.dataset.isPlaying === "true";
    if (isPlaying) {
        oscServer.pause(true);
        const songNames = [
            "Korte Relaxsessie",
            "Diepe ontspanning",
            "Meer rust in je hoofd",
            "Beter slapen",
            "Sublimale muzieksessie",
            "Recharge sessie",
            "Jezelf opladen",
            "Loslaten negatieve emoties",
            "Emotionele balans",
            "Beter eetpatroon"
        ];
        const songName = songNames[songIndex - 1];
      //  toggleBlankSquarePopup(`The song "${songName}" has stopped playing. How do u feel right now?`); // Pass custom text
    } else {
        oscServer.music(songIndex);
        oscServer.pause(false);
    }
    button.dataset.isPlaying = !isPlaying;
    updateButtonColor(songIndex, !isPlaying);
}
