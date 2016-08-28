"use strict";
var Universals_1 = require("./Universals");
var Ball_1 = require("./Ball");
var Planet_1 = require("./Planet");
var Body_1 = require("./Body");
var Victor = require('victor');
var Game = (function () {
    function Game(renderer) {
        this.renderer = renderer;
        this.balls = [new Ball_1.default(new Victor(0, 0), new Victor(10, 0), 10, 15, "red")];
        this.planets = this.genPlanets(5);
    }
    Game.prototype.randomPoint = function () {
        return new Victor(Math.random() * Universals_1.default.width, Math.random() * Universals_1.default.height);
    };
    Game.prototype.genPlanets = function (n) {
        var planets = [];
        var _loop_1 = function() {
            var radius = Math.random() * 100 + 10;
            var newPlanet = new Planet_1.default(this_1.randomPoint(), Math.PI * radius * radius, radius, "red");
            var distances = planets.map(function (p) { return Body_1.seperation(newPlanet, p); });
            if (Math.min.apply(Math, distances) < 10) {
                n++;
            }
            else {
                planets.push(newPlanet);
            }
        };
        var this_1 = this;
        for (; n > 0; n--) {
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
        var launched = new Ball_1.default(start, start.clone().subtract(end).multiplyScalar(0.65), 10, 15, "red");
        this.balls.push(launched);
    };
    return Game;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
//# sourceMappingURL=Game.js.map