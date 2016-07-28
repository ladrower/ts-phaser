"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stake_1 = require("../models/stake");
var Play = (function (_super) {
    __extends(Play, _super);
    function Play() {
        _super.apply(this, arguments);
    }
    Play.prototype.init = function () {
        this.stake = new stake_1.default(null, null);
    };
    Play.prototype.create = function () {
        var textStyle = { alight: "center", fill: "blue", font: "45px Arial", stroke: "blue" };
        var balanceText = this.game.add.text(500, this.game.world.centerY - 100, "Balance", textStyle);
        balanceText.anchor.set(0.5);
    };
    Play.prototype.updateBalance = function () {
    };
    return Play;
}(Phaser.State));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Play;
