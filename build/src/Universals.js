"use strict";
var tinycolor = require('tinycolor2');
var Victor = require('victor');
var bounds = new Victor(800, 800);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    delta: 0.1,
    bounds: bounds,
    teamColors: {
        "boccino": 'white',
        "red": tinycolor('red').toRgbString(),
        "green": tinycolor('green').toRgbString(),
    },
    launchPos: new Victor(80, bounds.y - 80)
};
//# sourceMappingURL=Universals.js.map