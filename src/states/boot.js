"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config_1 = require("../config");
var Boot = (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        _super.apply(this, arguments);
    }
    Boot.prototype.init = function () {
        this.stage.backgroundColor = config_1.basic.STAGE.COLOR;
    };
    Boot.prototype.create = function () {
        var _this = this;
        var STAGE = config_1.basic.STAGE;
        this.scale.setGameSize(STAGE.WIDTH, STAGE.HEIGHT);
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.windowConstraints.bottom = "visual";
        this.scale.onSizeChange.addOnce(function () { return _this.game.state.start("Preload"); });
    };
    return Boot;
}(Phaser.State));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Boot;
