"use strict";
var Universals_1 = require("./Universals");
var Victor = require('victor');
var Control = (function () {
    function Control(canvas, game) {
        var _this = this;
        this.canvas = canvas;
        this.game = game;
        canvas.ontouchstart = function (e) {
            _this.startDrag = _this.getXY(e);
            console.log(_this.startDrag);
            e.preventDefault();
        };
        canvas.onmousedown = function (e) {
            _this.startDrag = _this.getXY(e);
        };
        document.ontouchmove = function (e) {
            _this.mousePos = _this.getXY(e);
            e.preventDefault();
        };
        document.body.onmousemove = function (e) {
            _this.mousePos = _this.getXY(e);
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
    Control.prototype.getXY = function (e) {
        var clientP;
        if (e.touches) {
            clientP = new Victor(e.touches[0].clientX, e.touches[1].clientY);
        }
        else {
            clientP = new Victor(e.clientX, e.clientY);
        }
        var rect = this.canvas.getBoundingClientRect();
        var offset = new Victor(rect.left, rect.top);
        var scale = new Victor((Universals_1.default.bounds.x / this.canvas.scrollWidth), (Universals_1.default.bounds.y / this.canvas.scrollHeight));
        clientP.subtract(offset);
        clientP.multiply(scale);
        return clientP;
    };
    return Control;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Control;
//# sourceMappingURL=Control.js.map