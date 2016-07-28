"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        _super.apply(this, arguments);
    }
    default_1.prototype.init = function () {
        this.stage.backgroundColor = "#FF0000";
    };
    return default_1;
}(Phaser.State));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
