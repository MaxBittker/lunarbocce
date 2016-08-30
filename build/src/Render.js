"use strict";
var Ball_1 = require("./Ball");
var Universals_1 = require("./Universals");
var tinycolor = require('tinycolor2');
var Victor = require('victor');
var team;
(function (team) {
    team[team["boccino"] = 0] = "boccino";
    team[team["red"] = 1] = "red";
    team[team["green"] = 2] = "green";
})(team || (team = {}));
;
var Renderer = (function () {
    function Renderer(ctx) {
        this.ctx = ctx;
    }
    Renderer.prototype.render = function (bodys, shots) {
        this.ctx.fillStyle = "hsla(180, 0% ,10%,0.5)";
        this.ctx.fillRect(0, 0, Universals_1.default.bounds.x, Universals_1.default.bounds.y);
        var allBalls = bodys.concat(this.hudBalls(9 - shots));
        for (var i in allBalls) {
            var ball = allBalls[i];
            this.renderBall(ball);
        }
        this.renderShot();
    };
    Renderer.prototype.renderBall = function (body) {
        var lgrd = this.ctx.createLinearGradient(body.position.x - body.radius, body.position.y - body.radius, body.position.x + body.radius, body.position.y + body.radius);
        var rgrd = this.ctx.createRadialGradient(body.position.x, body.position.y, 0, body.position.x, body.position.y, body.radius);
        rgrd.addColorStop(0.1, tinycolor(body.color).toRgbString());
        rgrd.addColorStop(1, tinycolor(body.color).spin(50).darken(20).toRgbString());
        lgrd.addColorStop(0, tinycolor(body.color).darken(100).setAlpha(0.7).toRgbString());
        lgrd.addColorStop(1, tinycolor(body.color).lighten(100).setAlpha(0.7).toRgbString());
        this.ctx.fillStyle = rgrd;
        this.ctx.beginPath();
        this.ctx.arc(body.position.x, body.position.y, body.radius, 0, 180);
        this.ctx.fill();
        this.ctx.fillStyle = lgrd;
        this.ctx.beginPath();
        this.ctx.arc(body.position.x, body.position.y, body.radius, 0, 180);
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
    Renderer.prototype.hudBalls = function (nleft) {
        var left = [team.boccino];
        var i = 0;
        while (i < 4) {
            i++;
            left.push(team.red);
            left.push(team.green);
        }
        var balls = left.slice(9 - nleft).map(function (team, i) {
            return new Ball_1.default(new Victor(10 + (i * 20), 12), new Victor(0, 0), team);
        });
        return balls;
    };
    return Renderer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Renderer;
//# sourceMappingURL=Render.js.map