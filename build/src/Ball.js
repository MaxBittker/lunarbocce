"use strict";
var Victor = require('victor');
var Universals_1 = require("./Universals");
var Body_1 = require("./Body");
var Sound_1 = require("./Sound");
var bodyType;
(function (bodyType) {
    bodyType[bodyType["Ball"] = 0] = "Ball";
    bodyType[bodyType["Planet"] = 1] = "Planet";
})(bodyType || (bodyType = {}));
;
var Ball = (function () {
    function Ball(position, velocity, mass, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
    }
    Ball.prototype.getClosestWall = function () {
        var _this = this;
        var wallpoints = [(new Victor(this.position.x, 0)),
            (new Victor(this.position.x, Universals_1.default.width)),
            (new Victor(0, this.position.y)),
            (new Victor(Universals_1.default.width, this.position.y))];
        var closestwall = wallpoints.reduce(function (min, wp) {
            if (_this.position.distance(wp) < _this.position.distance(min)) {
                return wp;
            }
            return min;
        });
        return closestwall;
    };
    Ball.prototype.simpleBounce = function (point, radius) {
        var n = point.clone()
            .subtract(this.position)
            .normalize();
        this.velocity.subtract(n.clone().multiplyScalar(this.velocity.dot(n) * 2));
        var delta = (this.position.clone().subtract(point));
        var d = delta.length();
        var mtd = delta.clone().multiplyScalar(((this.radius + radius) - d) / d);
        this.position.add(mtd);
        Sound_1.default(this.velocity.length() / 50);
        this.velocity.multiplyScalar(0.7);
    };
    Ball.prototype.update = function (planets, balls) {
        var forceAcc = new Victor(0, 0);
        for (var p in planets) {
            var planet = planets[p];
            var force = 6.674 * Math.pow(10, 0) *
                planet.mass * this.mass /
                Math.pow(this.position.distance(planet.position), 2);
            forceAcc.add(planet.position.clone()
                .subtract(this.position)
                .normalize()
                .multiplyScalar(force));
            if (Body_1.seperation(this, planet) < 0.1) {
                forceAcc = new Victor(0, 0);
                break;
            }
        }
        this.velocity.add(forceAcc.multiplyScalar(Universals_1.default.delta / this.mass));
        this.position.add(this.velocity.clone().multiplyScalar(Universals_1.default.delta));
        if (this.position.distance(this.getClosestWall()) < this.radius) {
            this.simpleBounce(this.getClosestWall(), 0.1);
        }
        for (var p in planets) {
            var planet = planets[p];
            if (Body_1.seperation(this, planet) < 0) {
                this.simpleBounce(planet.position, planet.radius);
            }
        }
        for (var b in balls) {
            var ball = balls[b];
            if ((ball !== this) && (Body_1.seperation(this, ball) < 0)) {
                var delta = (this.position.clone().subtract(ball.position));
                var d = delta.length();
                var mtd = delta.clone().multiplyScalar(((this.radius + ball.radius) - d) / d);
                var im1 = 1 / this.mass;
                var im2 = 1 / ball.mass;
                this.position.add(mtd.clone().multiplyScalar(im1 / (im1 + im2)));
                ball.position.subtract(mtd.clone().multiplyScalar(im2 / (im1 + im2)));
                var v = this.velocity.clone().subtract(ball.velocity);
                var vn = v.dot(mtd.clone().normalize());
                if (vn > 0) {
                    continue;
                }
                var i = (-(0.9) * vn) / (im1 + im2);
                var impulse = mtd.clone().multiplyScalar(i);
                this.velocity.add(impulse.clone().multiplyScalar(im1));
                ball.velocity.subtract(impulse.clone().multiplyScalar(im2));
                Sound_1.default(impulse.length() / 5000);
            }
        }
    };
    return Ball;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ball;
//# sourceMappingURL=Ball.js.map