"use strict";
var Render_1 = require("./src/Render");
var Game_1 = require("./src/Game");
var Universals_1 = require("./src/Universals");
var Control_1 = require("./src/Control");
var initCanvas = function () {
    var canvas = document.createElement("canvas");
    canvas.width = Universals_1.default.width;
    canvas.height = Universals_1.default.height;
    var ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    var renderer = new Render_1.default(ctx);
    var game = new Game_1.default(renderer);
    var controls = new Control_1.default(canvas, game);
    renderer.controls = controls;
    return game;
};
var game = initCanvas();
var frame = function (timestamp) {
    game.tick();
    window.requestAnimationFrame(frame);
};
window.requestAnimationFrame(frame);
//# sourceMappingURL=entry.js.map