"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    registerDrawable: function (drawable) {
        this._drawables.push(drawable);
    },
    updateDrawables: function () {
        var _this = this;
        this._drawables.forEach(function (d) { return d.draw(_this); });
    },
};
