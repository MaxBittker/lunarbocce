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
        }
        this.velocity.add(forceAcc.multiplyScalar(Universals_1.default.delta / this.mass));
        this.position.add(this.velocity.clone().multiplyScalar(Universals_1.default.delta));
        for (var p in planets) {
            var planet = planets[p];
            if (Body_1.seperation(this, planet) < 0) {
                var n = planet.position.clone()
                    .subtract(this.position)
                    .normalize();
                this.velocity.subtract(n.multiplyScalar(this.velocity.dot(n) * 2));
                var delta = (this.position.clone().subtract(planet.position));
                var d = delta.length();
                var mtd = delta.multiplyScalar(((this.radius + planet.radius) - d) / d);
                this.position.add(mtd);
                Sound_1.default(this.velocity.length() / 50);
                this.velocity.multiplyScalar(0.7);
            }
        }
        for (var b in balls) {
            var ball = balls[b];
            if (ball !== this && Body_1.seperation(this, ball) < 0) {
                var delta = (this.position.clone().subtract(ball.position));
                var d = delta.length();
                var mtd = delta.multiplyScalar(((this.radius + ball.radius) - d) / d);
                var im1 = 1 / this.mass;
                var im2 = 1 / ball.mass;
                this.position.add(mtd.multiplyScalar(im1 / (im1 + im2)));
                ball.position.subtract(mtd.multiplyScalar(im2 / (im1 + im2)));
                var v = this.velocity.clone().subtract(ball.velocity);
                var vn = v.dot(mtd.clone().normalize());
                if (vn > 0)
                    return;
                var i = (-(1.0 + 1.0) * vn) / (im1 + im2);
                var impulse = mtd.multiplyScalar(i);
                this.velocity.add(impulse.multiplyScalar(im1));
                ball.velocity.subtract(impulse.multiplyScalar(im2));
            }
        }
    };
    return Ball;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ball;
//# sourceMappingURL=Ball.js.map