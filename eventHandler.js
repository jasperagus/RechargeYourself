// eventHandler.js

var sendOSC = require('./osc.js');

var oscServer = new sendOSC();

const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");
const btn5 = document.getElementById("btn5");
const btn6 = document.getElementById("btn6");
const btn7 = document.getElementById("btn7");
const btn8 = document.getElementById("btn8");
const btn9 = document.getElementById("btn9");
const btn10 = document.getElementById("btn10");
const btn11 = document.getElementById("btn11");
const btn12 = document.getElementById("btn12");

oscServer.pause();

oscServer.listen();

btn1.onclick = e => {
    oscServer.music(1);
    Listen();
    colorchange("btn1");
}

btn2.onclick = e => {
    oscServer.music(2);
    Listen();
    colorchange("btn2");
}

btn3.onclick = e => {
    oscServer.music(3);
    Listen();
    colorchange("btn3");
}

btn4.onclick = e => {
    oscServer.music(4);
    Listen();
    colorchange("btn4");
}

btn5.onclick = e => {
    oscServer.music(5);
    Listen();
    colorchange("btn5");
}

btn6.onclick = e => {
    oscServer.music(6);
    Listen();
    colorchange("btn6");
}

btn7.onclick = e => {
    oscServer.music(7);
    Listen();
    colorchange("btn7");
}
btn8.onclick = e => {
    oscServer.music(8);
    Listen();
    colorchange("btn8");
}
btn9.onclick = e => {
    oscServer.music(9);
    Listen();
    colorchange("btn9");
}
btn10.onclick = e => {
    oscServer.music(10);
    Listen();
    colorchange("btn10");
}
btn11.onclick = e => {
    oscServer.music(11);
    Listen();
    colorchange("btn11");
}
btn12.onclick = e => {
    oscServer.resume();
    Listen();
    colorchange2("btn12");
}

function colorchange(id) {
    var background = document.getElementById(id).style.backgroundColor;

    var buttons = document.getElementsByTagName('button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "rgb(182,182,182)";
        buttons[i].style.outline = "rgb(182,182,182)";
    }

    if (background == "rgb(177, 155, 181)") {
        document.getElementById(id).style.backgroundColor = "rgb(182,182,182)";
        document.getElementById(id).style.outline = "rgb(182,182,182)";
    } else {
        document.getElementById(id).style.backgroundColor = "rgb(177,155,181)";
        document.getElementById(id).style.outline = "rgb(177,155,181)";
    }
}

function colorchange2(id) {
    var background = document.getElementById(id).style.backgroundColor;

    var buttons = document.getElementsByTagName('button');
    if (background == "rgb(177, 155, 181)") {
        document.getElementById(id).style.backgroundColor = "rgb(182,182,182)";
        document.getElementById(id).style.outline = "rgb(182,182,182)";
    } else {
        document.getElementById(id).style.backgroundColor = "rgb(177,155,181)";
        document.getElementById(id).style.outline = "rgb(177,155,181)";
    }
}

function Listen() {
    oscServer.listen();
}

// Add an event listener for the custom 'songEnded' event
document.addEventListener("songEnded", (event) => {
    const songIndex = event.detail.songIndex;
    console.log(`Song ${songIndex} has ended.`);
    // Perform actions needed when the song ends, such as updating UI or resetting states
});
