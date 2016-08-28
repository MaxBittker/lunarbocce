"use strict";
var Universals_1 = require("./Universals");
var Renderer = (function () {
    function Renderer(ctx) {
        this.ctx = ctx;
    }
    Renderer.prototype.render = function (balls) {
        this.ctx.fillStyle = "hsla(180, 0% ,10%,0.5)";
        this.ctx.fillRect(0, 0, Universals_1.default.width, Universals_1.default.height);
        for (var i in balls) {
            var ball = balls[i];
            this.renderBall(ball);
        }
        this.renderShot();
    };
    Renderer.prototype.renderBall = function (ball) {
        var lgrd = this.ctx.createLinearGradient(ball.position.x - ball.radius, ball.position.y - ball.radius, ball.position.x + ball.radius, ball.position.y + ball.radius);
        var rgrd = this.ctx.createRadialGradient(ball.position.x, ball.position.y, 0, ball.position.x, ball.position.y, ball.radius);
        lgrd.addColorStop(0, "black");
        lgrd.addColorStop(1, "white");
        rgrd.addColorStop(0, "rgba(200, 0, 200, 0.1)");
        rgrd.addColorStop(1, "rgba(0, 0, 200, 0.2)");
        this.ctx.fillStyle = lgrd;
        this.ctx.beginPath();
        this.ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 180);
        this.ctx.fill();
        this.ctx.fillStyle = rgrd;
        this.ctx.beginPath();
        this.ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 180);
        this.ctx.fill();
    };
    Renderer.prototype.renderShot = function () {
        if (this.controls.startDrag && this.controls.mousePos) {
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
            this.ctx.strokeStyle = "rgba(200, 200, 200, 0.2)";
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.controls.startDrag.x, this.controls.startDrag.y);
            this.ctx.lineTo(this.controls.mousePos.x, this.controls.mousePos.y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(this.controls.startDrag.x, this.controls.startDrag.y, this.controls.startDrag.distance(this.controls.mousePos) / 5, 0, 180);
            this.ctx.fill();
        }
    };
    return Renderer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Renderer;
//# sourceMappingURL=Render.js.map