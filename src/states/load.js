"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Load = (function (_super) {
    __extends(Load, _super);
    function Load() {
        _super.apply(this, arguments);
        this.isCreated = false;
    }
    Load.prototype.init = function () {
        var _this = this;
        this.time.events.add(Load.loadingDebounce, function () { return _this.isCreated
            ? _this.start()
            : _this.processLoading(function () { return _this.start(); }); });
    };
    Load.prototype.processLoading = function (onComplete) {
        var _this = this;
        var tweenInterval = [0, 0.9];
        var loadBar = this.add.graphics(0, this.game.height - 50)
            .lineStyle(5, 0xffffff, 1)
            .moveTo(0, 0)
            .lineTo(this.game.width, 0);
        loadBar.scale.x = tweenInterval[0];
        var loadText = this.game.add.text(this.world.centerX, this.game.height - 100, this.game.myLocale.loading, {
            alight: "center",
            fill: "#FFF",
            font: "45px Arial",
            stroke: "#FFF",
        });
        loadText.anchor.set(0.5);
        var progressTween = this.add.tween(loadBar.scale)
            .to({ x: tweenInterval[1] }, 3000, Phaser.Easing.Quadratic.InOut, true)
            .onUpdateCallback(function () {
            if (_this.isCreated) {
                var fadeOutTween = _this.add.tween((function (g) { return g.addMultiple([loadBar, loadText]) && g; })(_this.add.group()))
                    .to({ alpha: 0 }, 500);
                progressTween.stop();
                _this.add.tween(loadBar.scale)
                    .to({ x: 1 }, 500, Phaser.Easing.Quadratic.In, true)
                    .chain(fadeOutTween);
                fadeOutTween.delay(500).onComplete.add(onComplete);
            }
            else if (loadBar.scale.x > tweenInterval[0] + (tweenInterval[1] - tweenInterval[0]) / 2) {
                tweenInterval[0] = loadBar.scale.x;
                progressTween.timeScale /= 2;
            }
        });
    };
    Load.prototype.preload = function () {
        this.load.image("space", "./assets/images/space.jpg");
    };
    Load.prototype.create = function () {
        var _this = this;
        this.time.events.add(this.rnd.integerInRange(2000, 5000), function () { return _this.isCreated = true; });
    };
    Load.prototype.start = function () {
    };
    Load.loadingDebounce = 500;
    return Load;
}(Phaser.State));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Load;
