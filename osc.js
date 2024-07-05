const { Howl } = require('howler');

class sendOSC {
    constructor() {
        this.index = 0;
        this.firstClick = true;
        this.sound = null;
        this.timePosition = 0;

        // Event listener for keyboard events
        document.addEventListener('keydown', (event) => {
            if (event.key >= '1' && event.key <= '9') {
                const songIndex = parseInt(event.key);
                this.music(songIndex);
            } else if (event.key === '0') {
                this.music(10); // Handle key '0' for song index 10
            }
        });
    }

    music(value) {
        // Reset player state
        this.pause(true); // Pause any ongoing playback
        clearInterval(this.seekBarInterval); // Clear interval for updating seek bar
        document.getElementById("btnPlayPause").innerText = "Play"; // Reset play/pause button text
        document.getElementById("seekBar").value = 0; // Reset seek bar position
    
        // Start playing the selected song
        if (this.firstClick || this.index !== value) {
            this.index = value;
            this.SetMusic(value);
            this.firstClick = false;
        } else {
            this.pause(!this.sound.playing());
        }
    }
    
    reset() {
        // Reset player state
        this.pause(true); // Pause any ongoing playback
        clearInterval(this.seekBarInterval); // Clear interval for updating seek bar
        document.getElementById("btnPlayPause").innerText = "Play"; // Reset play/pause button text
        document.getElementById("seekBar").value = 0; // Reset seek bar position
        this.index = 0; // Reset selected song index
        this.firstClick = true; // Reset firstClick flag
        this.sound = null; // Reset sound object
        this.timePosition = 0; // Reset time position
    }
    

    SetMusic(value) {
        let songNames = [
            { name: "Korte Relaxsessie", file: "01.Korterelaxsessie.mp3", message: "This is a short relaxation session." },
            { name: "Diepe Ontspanning", file: "02.DiepeOntspanning.mp3", message: "This is a deep relaxation session." },
            { name: "Meer rust in je hoofd", file: "03.Meerrustinjehoofd.mp3", message: "This session helps to clear your mind." },
            { name: "Beter slapen", file: "04.Beterslapen.mp3", message: "This session promotes better sleep." },
            { name: "Sublimale muzieksessie", file: "05.Sublimalemuzieksessie.mp3", message: "This session includes subliminal music." },
            { name: "Recharge sessie", file: "06.Rechargesessie.mp3", message: "Recharge and relax with this session." },
            { name: "Jezelf opladen", file: "07.Jezelfopladen.mp3", message: "Charge up yourself with this session." },
            { name: "Loslaten negatieve emoties", file: "08.Loslatennegatieveemoties.mp3", message: "Release negative emotions with this session." },
            { name: "Emotionele balans", file: "09.Emotionelebalans.mp3", message: "Find emotional balance with this session." },
            { name: "Beter eetpatroon", file: "10.Betereetpatroon.mp3", message: "Improve your eating habits with this session." }
        ];
    
        if (value >= 1 && value <= songNames.length) {
            const selectedSong = songNames[value - 1];
            this.sound = new Howl({
                src: [selectedSong.file],
                html5: true
            });
            this.sound.play();
            this.pause(false);
        }
    }

    pause(pause) {
        if (this.sound) {
            if (pause) {
                this.sound.pause();
            } else {
                this.sound.play();
            }
        }
    }
}

module.exports = sendOSC;