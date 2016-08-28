"use strict";
var Victor = require('victor');
var Planet = (function () {
    function Planet(position, mass, radius, color) {
        this.position = position;
        this.velocity = new Victor(0, 0);
        this.mass = mass;
        this.radius = radius;
        this.color = color;
    }
    return Planet;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Planet;
//# sourceMappingURL=Planet.js.map