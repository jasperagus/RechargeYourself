const Client = require('node-osc').Client;
const Server = require('node-osc').Server;
var { Howl } = require('howler');


const server = new Server(9002, '127.0.0.1', () => {
    console.log('OSC server started');
});
const client = new Client('127.0.0.1', 9001, () => {
    console.log('OSC client started');
});


class sendOSC {
    constructor() {
        this.index = 0;
        this.firstClick = true;
        this.sound = new Howl({
            src: ['./NOTbackground.mp3'],
            autoplay: true,
            loop: false,
            volume: 1
        });
    }

    music(value) {
        if (this.firstClick) {
            this.firstClick = false;
            this.pause(true);
            this.index = value;
            this.SetMusic(value);
            return;
        }
        if (this.firstClick == false && this.index == value) {
            this.pause(false);
            this.firstClick = true;
            this.index = value;
            this.SetMusic(value);
            return;
        }
        if (this.index !== value) {
            this.pause(true);
            this.index = value;
            this.SetMusic(value);
            return;
        }

    }

    resume() {
        if (this.firstClick) {
            this.firstClick = false;
            this.pause(true);
            return;
        }
        if (this.firstClick == false) {
            this.pause(false);
            this.firstClick = true;
            return;
        }

    }

    SetMusic(value) {
        client.send('lj/osc/music', value - 1, () => {
            console.log("Send music command");
        });
    }
    pause(val) {
        client.send('lj/osc/pause', val ? 1 : 0)
        console.log("Send play/pause command");
        if (val == true) {
            this.sound.stop();
            console.log("stopped");
        } else {
            console.log("music in lj has stoppped");
            this.sound.play();
            console.log("play");
        }
    }


    listen() {
        console.log("listening")
        server.on('message', (msg) => { this.pause(); console.log("message recieved") });
    }
}

module.exports = sendOSC;