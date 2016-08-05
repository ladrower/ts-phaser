import {basic as config} from "../config";
import Base from "./base";
import Drawable from "../mixins/models/drawable";
import Stake from "./stake";
import IHTTP from "../interfaces/iHttp";
import Http from "../services/http";

interface SpinResponse {
    winType: "none" | 'regular' | "bigWin";
    totalWin: number;
    spinResult: Array<string>;
}

export default class Slots extends Drawable(Base) {
    protected http: IHTTP = new Http(config.API_BASE);

    constructor(protected _stake: Stake, protected _balance = 1000) {
        super();
    }

    get stake() {
        return this._stake;
    }

    get balance() {
        return this._balance;
    }

    set balance(value) {
      this._balance = value;
      this.draw(["balance"]);
    }

    public draw(props: Array<string>) {
        super.draw(props);
        if (props.indexOf("stake") !== -1) {
            this._stake.draw(["symbol", "bet"]);
        }
    }

    public spin() {
        this.balance -= this._stake.bet;
        return this.http.post("action.php", {
            action: "SpinRequest",
            data: {
                "symbol": this._stake.symbol,
                "bet": this._stake.bet,
            },
        }).then((response) => {
            let data: SpinResponse = response.data;

            return data;
        });
    }
}
