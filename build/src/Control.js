"use strict";
var Victor = require('victor');
var Control = (function () {
    function Control(canvas, game) {
        var _this = this;
        this.canvas = canvas;
        this.game = game;
        canvas.ontouchstart = function (e) {
            console.log("startdrag");
            _this.startDrag = new Victor(e.touches[0].clientX - _this.canvas.offsetLeft, e.touches[0].clientY - _this.canvas.offsetTop);
            console.log(_this.startDrag);
            e.preventDefault();
        };
        canvas.onmousedown = function (e) {
            _this.startDrag = new Victor(e.offsetX, e.offsetY);
        };
        document.ontouchmove = function (e) {
            _this.mousePos = new Victor(e.touches[0].clientX - _this.canvas.offsetLeft, e.touches[0].clientY - _this.canvas.offsetTop);
            e.preventDefault();
        };
        document.body.onmousemove = function (e) {
            _this.mousePos = new Victor(e.clientX - _this.canvas.offsetLeft, e.clientY - _this.canvas.offsetTop);
        };
        document.body.ontouchend = function (e) {
            _this.game.launch(_this.startDrag, _this.mousePos);
            _this.startDrag = undefined;
            e.preventDefault();
        };
        document.body.onmouseup = function (e) {
            _this.game.launch(_this.startDrag, _this.mousePos);
            _this.startDrag = undefined;
        };
    }
    return Control;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Control;
//# sourceMappingURL=Control.js.map