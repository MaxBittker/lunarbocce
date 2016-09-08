"use strict";
var Universals_1 = require("./Universals");
var Ball_1 = require("./Ball");
var Planet_1 = require("./Planet");
var Body_1 = require("./Body");
var Victor = require('victor');
var tinycolor = require('tinycolor2');
var team;
(function (team) {
    team[team["boccino"] = 0] = "boccino";
    team[team["red"] = 1] = "red";
    team[team["green"] = 2] = "green";
})(team || (team = {}));
;
var stage;
(function (stage) {
    stage[stage["play"] = 0] = "play";
    stage[stage["score"] = 1] = "score";
    stage[stage["waiting"] = 2] = "waiting";
})(stage || (stage = {}));
;
var Game = (function () {
    function Game(renderer) {
        this.newGame();
        this.renderer = renderer;
        this.animTick = 0;
        this.points = {};
        this.points[team.red] = 0;
        this.points[team.green] = 0;
    }
    Game.prototype.newGame = function () {
        this.stage = stage.play;
        this.balls = [];
        this.planets = this.genPlanets();
    };
    Game.prototype.randomPoint = function () {
        var e = 210;
        var p = new Victor(0, 0);
        p.randomize(new Victor(e, (e / 2)), new Victor(Universals_1.default.bounds.x - (e / 2), Universals_1.default.bounds.y - e));
        return p;
    };
    Game.prototype.genPlanets = function () {
        var n = Universals_1.default.bounds.x * Universals_1.default.bounds.y * .15;
        var on = n;
        var planets = [];
        var fuse = 10000;
        var _loop_1 = function() {
            var radius = Math.random() * 140 * (n / on) + 40;
            var newPlanet = new Planet_1.default(this_1.randomPoint(), Math.PI * radius * radius, radius, tinycolor.random().darken(0.9).toRgbString());
            var distances = planets.map(function (p) { return Body_1.seperation(newPlanet, p); });
            if (Math.min.apply(Math, distances) > 100) {
                n -= (radius * radius * Math.PI);
                planets.push(newPlanet);
            }
            fuse--;
            if (fuse < 0)
                return "break";
        };
        var this_1 = this;
        while (n > 0) {
            var state_1 = _loop_1();
            if (state_1 === "break") break;
        }
        return planets;
    };
    Game.prototype.tick = function () {
        var _this = this;
        var bodys = this.balls.concat(this.planets);
        this.renderer.render(bodys, this.balls.length, (this.points[team.red] < this.points[team.green]) ? team.green : team.red);
        this.renderer.renderHUD(this.points);
        if (this.stage === stage.play) {
            var settle = this.balls.map(function (b) { return b.update(_this.planets, _this.balls); });
            if (this.stage === stage.play && this.balls.length === 9 && settle.every(function (i) { return i; })) {
                this.stage = stage.score;
                this.animTick = 0;
            }
        }
        if (this.stage === stage.score || this.stage === stage.waiting) {
            var done = this.renderer.renderScore(this.balls[0], this.score(), this.animTick);
            this.animTick++;
            if (done) {
                if (this.stage == stage.score)
                    this.points[this.score()[0].ball.teamon] += (this.score().length - 1);
                this.stage = stage.waiting;
            }
        }
    };
    Game.prototype.launch = function (start, end) {
        var isBoccino = this.balls.length == 0;
        var type = team.boccino;
        var offset = (this.points[team.red] < this.points[team.green]) ? 1 : 0;
        if (!isBoccino) {
            type = (this.balls.length + offset) % 2 ? team.red : team.green;
        }
        var launched = new Ball_1.default(Universals_1.default.launchPos.clone(), start.clone().subtract(end).multiplyScalar(0.65), type);
        if (this.balls.length < 9 && (start.clone().subtract(end).multiplyScalar(0.65).length() > 15)) {
            this.balls.push(launched);
        }
        else if (this.stage === stage.waiting) {
            this.newGame();
        }
    };
    Game.prototype.score = function () {
        var boccino = this.balls[0];
        var balls = this.balls.slice(1);
        var distances = balls.map(function (ball) {
            return { d: ball.position.distance(boccino.position), ball: ball };
        }).sort(function (a, b) { return a.d - b.d; });
        var winnerTeam = distances[0].ball.teamon;
        for (var i = 0; i < distances.length; i++) {
            if (distances[i].ball.teamon != winnerTeam)
                return (distances.slice(0, i + 1));
        }
        throw ("?");
    };
    return Game;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
//# sourceMappingURL=Game.js.map