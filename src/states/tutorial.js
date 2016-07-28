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
    default_1.prototype.create = function () {
        var _this = this;
        var textStyle = { alight: "center", fill: "blue", font: "45px Arial", stroke: "blue" };
        var title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, "ES2015 Wizard", textStyle);
        title.anchor.set(0.5);
        textStyle.font = "36px Arial";
        var instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '"s" key to start', textStyle);
        instructions.anchor.set(0.5);
        var controlMessage = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 150, "use arrow keys to move", textStyle);
        controlMessage.anchor.set(0.5);
        var muteMessage = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 225, '"SPACEBAR" to win.', textStyle);
        muteMessage.anchor.set(0.5);
        var sKey = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        sKey.onDown.addOnce(function () { return _this.game.state.start("play"); });
    };
    return default_1;
}(Phaser.State));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
