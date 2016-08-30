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
var Game = (function () {
    function Game(renderer) {
        this.renderer = renderer;
        this.balls = [];
        this.planets = this.genPlanets();
    }
    Game.prototype.newGame = function () {
        this.balls = [];
        this.planets = this.genPlanets();
    };
    Game.prototype.randomPoint = function () {
        var e = 190;
        var p = new Victor(0, 0);
        p.randomize(new Victor(e, e), new Victor(Universals_1.default.bounds.x - e, Universals_1.default.bounds.y - e));
        return p;
    };
    Game.prototype.genPlanets = function () {
        var n = Universals_1.default.bounds.x * Universals_1.default.bounds.y * .3;
        var on = n;
        var planets = [];
        var fuse = 10000;
        var _loop_1 = function() {
            var radius = Math.random() * 100 * (n / on) + 30;
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
        this.renderer.render(bodys, this.balls.length);
        this.balls.forEach(function (b) { return b.update(_this.planets, _this.balls); });
    };
    Game.prototype.launch = function (start, end) {
        var isBoccino = this.balls.length == 0;
        var type = team.boccino;
        if (!isBoccino) {
            type = this.balls.length % 2 ? team.red : team.green;
        }
        var launched = new Ball_1.default(start, start.clone().subtract(end).multiplyScalar(0.65), type);
        this.balls.push(launched);
        if (this.balls.length === 10) {
            this.newGame();
        }
    };
    Game.prototype.score = function () {
        var boccino = this.balls[0];
        var balls = this.balls.slice(1);
        balls.map(function (ball) {
            return ball.position.distance(boccino.position);
        });
    };
    return Game;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
//# sourceMappingURL=Game.js.map