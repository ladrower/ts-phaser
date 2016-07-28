"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var config_1 = require("../config");
var preloadAnimation_1 = require("../mixins/states/preloadAnimation");
var Boot = (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        _super.apply(this, arguments);
    }
    Boot.prototype.create = function () {
        this.p0 = new Phaser.Point(this.world.centerX, this.world.centerY);
        this.p1 = new Phaser.Point(0, 0);
        this.p2 = new Phaser.Point(0, 0);
        this.p3 = new Phaser.Point(0, 0);
        this.p2.rotate(this.world.centerX, this.world.centerY, 120, true);
        this.p3.rotate(this.world.centerX, this.world.centerY, 240, true);
        this.startPreLoading();
    };
    Boot.prototype.startPreLoading = function () {
        this.load.json("config", config_1.basic.API_BASE + config_1.basic.CONFIG_PATH);
        this.load.onFileComplete.add(this.onFileComplete, this);
        this.load.onLoadComplete.addOnce(this.onPreLoadComplete, this);
        this.load.start();
    };
    Boot.prototype.onFileComplete = function (progress, key, success) {
        if (success) {
            switch (key) {
                case "config":
                    {
                        this.game.myConfig = this.cache.getJSON("config");
                        var _a = this.game.myConfig, localePath = _a.localePath, locale = _a.locale;
                        this.load.json("locale", config_1.basic.API_BASE + localePath + locale + ".json");
                    }
                    break;
            }
        }
        else {
            this.load.onFileComplete.remove(this.onFileComplete, this);
            this.game.state.start("Loadfail");
        }
    };
    Boot.prototype.onPreLoadComplete = function () {
        this.game.myLocale = this.cache.getJSON("locale");
    };
    Boot.prototype.update = function () {
        var d = Math.abs(Math.sin(this.p1.angle(this.p0))) * (Math.min(this.world.width, this.world.height) / 2 - 100);
        this.p1.rotate(this.world.centerX, this.world.centerY, 2, true, d);
        this.p2.rotate(this.world.centerX, this.world.centerY, 2, true, d);
        this.p3.rotate(this.world.centerX, this.world.centerY, 2, true, d);
    };
    Boot.prototype.render = function () {
        this.game.context.fillStyle = "rgb(255,0,0)";
        this.game.context.fillRect(this.p1.x + 10, this.p1.y + 10, 20, 20);
        this.game.context.fillStyle = "rgb(0,255,0)";
        this.game.context.fillRect(this.p2.x + 10, this.p2.y + 10, 20, 20);
        this.game.context.fillStyle = "rgb(0,0,255)";
        this.game.context.fillRect(this.p3.x + 10, this.p3.y + 10, 20, 20);
    };
    return Boot;
}(preloadAnimation_1.default(Phaser.State)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Boot;
