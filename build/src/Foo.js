"use strict";
var assign = require("object-assign");
var Bar_1 = require("./Bar");
var Foo = (function () {
    function Foo(config) {
        this.bar = new Bar_1.default;
        this.config = assign({}, config);
    }
    return Foo;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Foo;
console.log("HEY");
//# sourceMappingURL=Foo.js.map