"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config = require("./config");
var states = require("./states/");
var Game = (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = this;
        _super.call(this, 0, 0, Phaser.CANVAS, config.basic.STAGE.CONTAINER, null);
        Object.keys(states).forEach(function (state) { return _this.state.add(state, states[state]); });
        this.state.start(config.basic.BOOTSTRAP_STATE);
    }
    return Game;
}(Phaser.Game));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Game;
