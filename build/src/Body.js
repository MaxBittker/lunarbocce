"use strict";
var seperation = function (a, b) {
    return (a.position.distance(b.position)) - (a.radius + b.radius);
};
exports.seperation = seperation;
//# sourceMappingURL=Body.js.map