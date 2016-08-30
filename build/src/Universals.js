"use strict";
var tinycolor = require('tinycolor2');
var Victor = require('victor');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    delta: 0.1,
    bounds: new Victor(800, 800),
    teamColors: {
        "boccino": 'white',
        "red": tinycolor('red').toRgbString(),
        "green": tinycolor('green').toRgbString(),
    }
};
//# sourceMappingURL=Universals.js.map