"use strict";
var Ball_1 = require("./Ball");
var Universals_1 = require("./Universals");
var tinycolor = require('tinycolor2');
var Victor = require('victor');
var Sound_1 = require("./Sound");
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
        this.ctx.strokeStyle = "rgba(200, 200, 200, 0.2)";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([6, 15]);
        this.ctx.arc(Universals_1.default.launchPos.x, Universals_1.default.launchPos.y, 50, 45, 45 + 180);
        this.ctx.stroke();
        if (this.controls.startDrag && this.controls.mousePos) {
            var v = this.controls.startDrag.clone().subtract(this.controls.mousePos)
                .multiplyScalar(0.3);
            this.ctx.fillStyle = "rgba(200, 200, 200, 0.2)";
            this.ctx.strokeStyle = "rgba(200, 200, 200, 0.2)";
            this.ctx.lineWidth = v.length() / 6;
            this.ctx.setLineDash([1]);
            var endP = Universals_1.default.launchPos.clone().subtract(v);
            this.ctx.beginPath();
            this.ctx.moveTo(Universals_1.default.launchPos.x, Universals_1.default.launchPos.y);
            this.ctx.lineTo(endP.x, endP.y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(Universals_1.default.launchPos.x, Universals_1.default.launchPos.y, this.controls.startDrag.distance(this.controls.mousePos) / 5, 0, 180);
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
            var offset = Universals_1.default.bounds.y - (100 + (i * 20));
            return new Ball_1.default(new Victor(12, offset), new Victor(0, 0), team);
        });
        return balls;
    };
    Renderer.prototype.renderHUD = function (points) {
        this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        this.ctx.font = "30px 'Helvetica'";
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.fillStyle = tinycolor(Universals_1.default.teamColors.red).darken(20).toRgbString();
        this.ctx.fillText(points[team.red].toString(), 10, 30);
        this.ctx.fillStyle = tinycolor(Universals_1.default.teamColors.green).darken(10).toRgbString();
        this.ctx.fillText(points[team.green].toString(), 40, 30);
    };
    Renderer.prototype.renderScore = function (boccino, scoreBalls, animTick) {
        this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        this.ctx.font = "30px 'Helvetica'";
        this.ctx.textBaseline = 'alphabetic';
        animTick /= 1.5;
        var done = true;
        var rate = 1;
        for (var i = 0; i < scoreBalls.length; i++) {
            var ball = scoreBalls[i].ball;
            var d = scoreBalls[i].d;
            var r = Math.min(animTick, d);
            if (animTick <= d) {
                done = false;
            }
            if ((d | 0) === (r | 0) && (d | 0) === (animTick | 0)) {
                Sound_1.playDing(scoreBalls.length - (i + 1));
            }
            if (d === r) {
                var mark = (i + 1).toString();
                this.ctx.fillStyle = tinycolor(ball.color).darken(20).toRgbString();
                if (i == scoreBalls.length - 1) {
                    mark = '✖';
                }
                this.ctx.lineCap = "round";
                this.ctx.lineWidth = 1;
                this.ctx.setLineDash([]);
                this.ctx.fillText(mark, ball.position.x, ball.position.y);
                this.ctx.strokeText(mark, ball.position.x, ball.position.y);
            }
            animTick -= r;
            this.ctx.lineCap = "round";
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([3, 10]);
            this.ctx.beginPath();
            this.ctx.arc(boccino.position.x, boccino.position.y, r, 0, 180);
            this.ctx.stroke();
        }
        if (!done) {
            Sound_1.playClick(rate);
        }
        return done;
    };
    return Renderer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Renderer;
//# sourceMappingURL=Render.js.map