"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (superclass) { return (function (_super) {
    __extends(PreloadAnimations, _super);
    function PreloadAnimations() {
        _super.apply(this, arguments);
    }
    PreloadAnimations.prototype.foo = function () {
        console.log("foo from MyMixin");
    };
    return PreloadAnimations;
}(superclass)); };
