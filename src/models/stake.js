"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require("./base");
var Drawable = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.foo = function () {
        console.log("foo from MyMixin");
    };
    return class_1;
}(superclass)); };
var Drawable2 = function (superclass) { return (function (_super) {
    __extends(Drawable2, _super);
    function Drawable2() {
        _super.apply(this, arguments);
    }
    Drawable2.prototype.foo = function () {
        _super.prototype.foo.call(this);
        console.log("foo from MyMixin2");
    };
    return Drawable2;
}(superclass)); };
var Some = (function (_super) {
    __extends(Some, _super);
    function Some() {
        _super.apply(this, arguments);
    }
    return Some;
}(base_1.default));
var Stake = (function (_super) {
    __extends(Stake, _super);
    function Stake(symbol, bet) {
        _super.call(this);
        this.symbol = symbol;
        this.bet = bet;
    }
    Stake.prototype.foo = function () {
        _super.prototype.foo.call(this);
        console.log("foo from Stake");
    };
    return Stake;
}(Drawable2(Drawable(Some))));
var s = new Stake(1, 2);
s.foo();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stake;
