const { Howl } = require('howler');
const { Client, Server } = require('node-osc');

class sendOSC {
    constructor() {
        this.index = 0;
        this.firstClick = true;
        this.sound = null;

        // Initialize OSC server and client
        this.server = new Server(9002, '127.0.0.1', () => {
            console.log('OSC server started');
        });
        this.client = new Client('127.0.0.1', 9001, () => {
            console.log('OSC client started');
        });

        // Setup message listener
        this.listen();
    }

    handleSongEnded() {
        // Handle actions when a song ends
        console.log('Song has ended');
        // Update your UI or perform other actions here
        // For example, update a div on your webpage to notify the user
        document.getElementById('songStatus').innerText = 'Song ended';
    }

    listen() {
        this.server.on('message', (msg) => {
            console.log("OSC message received:", msg);

            // Handle messages from OSC server
            if (msg[0] === '/lj/osc/music') {
                const value = parseInt(msg[1]) + 1; // Adjust index from OSC message
                this.music(value);
            } else if (msg[0] === '/lj/osc/pause') {
                const pause = msg[1] === 1;
                this.pause(pause);           
            }
        });
    }

    music(value) {
        // Reset player state
        this.pause(true); // Pause any ongoing playback
        clearInterval(this.seekBarInterval); // Clear interval for updating seek bar
        document.getElementById("btnPlayPause").innerText = "Play"; // Reset play/pause button text
        document.getElementById("seekBar").value = 0; // Reset seek bar position

        // Handle two-click behavior
        if (this.firstClick) {
            this.firstClick = false;
            this.index = value;
            this.SetMusic(value);
        } else if (this.index !== value) {
            this.pause(true);
            this.index = value;
            this.SetMusic(value);
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

            // Local playback
            this.sound = new Howl({
                src: [selectedSong.file],
                html5: true
            });

            // OSC command
            this.client.send('lj/osc/music', value - 1, () => {
                console.log("Send music command");
            });

            // Only play on the second click
            if (!this.firstClick) {
                this.sound.play();
            }
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

        // OSC command
        this.client.send('lj/osc/pause', pause ? 1 : 0);
        this.server.addListener('message', (msg) => {
            console.log("OSC flipping message received:", msg);
        });
        console.log("Send play/pause command");

        
        if (pause) {
            console.log("pipo");
        } else {
            console.log("play");
        }
    }
}

module.exports = sendOSC;
