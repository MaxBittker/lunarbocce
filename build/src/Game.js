"use strict";
var Universals_1 = require("./Universals");
var Ball_1 = require("./Ball");
var Planet_1 = require("./Planet");
var Body_1 = require("./Body");
var Victor = require('victor');
var tinycolor = require('tinycolor2');
var Game = (function () {
    function Game(renderer) {
        this.renderer = renderer;
        this.balls = [];
        this.planets = this.genPlanets(60000);
    }
    Game.prototype.newGame = function () {
        this.balls = [];
        this.planets = this.genPlanets(60000);
    };
    Game.prototype.randomPoint = function () {
        var e = 190;
        var p = new Victor(0, 0);
        p.randomize(new Victor(e, e), new Victor(Universals_1.default.width - e, Universals_1.default.height - e));
        return p;
    };
    Game.prototype.genPlanets = function (n) {
        var planets = [];
        var _loop_1 = function() {
            var radius = Math.random() * 140 * (n / 60000) + 40;
            var newPlanet = new Planet_1.default(this_1.randomPoint(), Math.PI * radius * radius, radius, tinycolor.random().darken(0.9).toRgbString());
            var distances = planets.map(function (p) { return Body_1.seperation(newPlanet, p); });
            if (Math.min.apply(Math, distances) < 100) {
            }
            else {
                n -= (radius * radius * Math.PI);
                planets.push(newPlanet);
            }
        };
        var this_1 = this;
        while (n > 0) {
            _loop_1();
        }
        return planets;
    };
    Game.prototype.tick = function () {
        var _this = this;
        var bodys = this.balls.concat(this.planets);
        this.renderer.render(bodys);
        this.balls.forEach(function (b) { return b.update(_this.planets, _this.balls); });
    };
    Game.prototype.launch = function (start, end) {
        var isBoccino = this.balls.length == 0;
        var radius = isBoccino ? 9 : 15;
        var color = isBoccino ? tinycolor('white').toRgbString()
            : tinycolor('red').toRgbString();
        if (!isBoccino) {
            color = this.balls.length % 2 ? tinycolor('red').toRgbString()
                : tinycolor('green').toRgbString();
        }
        var launched = new Ball_1.default(start, start.clone().subtract(end).multiplyScalar(0.65), radius * radius * Math.PI, radius, color);
        this.balls.push(launched);
        if (this.balls.length === 10) {
            this.newGame();
        }
    };
    return Game;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
//# sourceMappingURL=Game.js.map