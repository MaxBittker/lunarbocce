"use strict";
var sound = new Audio('sounds/b2b1.wav');
var playSound = function (volume) {
    if (volume > 0.2 && (sound.currentTime > 0.01 || sound.currentTime === 0)) {
        sound.currentTime = 0;
        sound.volume = Math.min(1, volume);
        sound.play();
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = playSound;
//# sourceMappingURL=Sound.js.map