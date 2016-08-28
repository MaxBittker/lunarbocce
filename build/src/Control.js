"use strict";
var Victor = require('victor');
var Control = (function () {
    function Control(canvas, game) {
        var _this = this;
        this.canvas = canvas;
        this.game = game;
        canvas.onmousedown = function (e) {
            _this.startDrag = new Victor(e.offsetX, e.offsetY);
        };
        canvas.onmousemove = function (e) {
            _this.mousePos = new Victor(e.offsetX, e.offsetY);
        };
        canvas.onmouseup = function (e) {
            _this.game.launch(_this.startDrag, _this.mousePos);
            _this.startDrag = undefined;
        };
    }
    return Control;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Control;
//# sourceMappingURL=Control.js.map