"use strict";
var sound = new Audio('sounds/b2b1.wav');
var click = new Audio('sounds/click.wav');
var adign = new Audio('sounds/ading.wav');
var dings = [
    new Audio('sounds/ading.wav'),
    new Audio('sounds/ding0.wav'),
    new Audio('sounds/ding1.wav'),
    new Audio('sounds/ding2.wav'),
    new Audio('sounds/ding3.wav'),
];
var playSound = function (volume) {
    volume -= 0.2;
    if (volume > 0.2 && (sound.currentTime > 0.01 || sound.currentTime === 0)) {
        sound.currentTime = 0;
        sound.volume = Math.min(1, volume);
        sound.play();
    }
};
exports.playSound = playSound;
var playClick = function (speed) {
    click.playbackRate = 1.1;
    click.volume = Math.min(1, 0.7);
    click.play();
};
exports.playClick = playClick;
var playDing = function (n) {
    dings[n].play();
};
exports.playDing = playDing;
//# sourceMappingURL=Sound.js.map