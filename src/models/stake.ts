
import Base from "./base";
import Drawable from "../mixins/models/drawable";

class Stake extends Drawable(Base) {

    constructor(protected _symbol: string, protected _bet: number) {
        super();
    }

    public isValid(): boolean {
      return this._symbol !== null && this._bet !== null;
    }

    get symbol() {
      return this._symbol;
    }
    set symbol(value) {
      this._symbol = value;
      this.draw(["symbol"]);
    }

    get bet() {
      return this._bet;
    }
    set bet(value) {
      this._bet = value;
      this.draw(["bet"]);
    }

}

export default Stake;
