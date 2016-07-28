
import Stake from "../models/stake";

export default class Play extends Phaser.State {
    public stake: Stake;

    public init() {

        this.stake = new Stake(null, null);
    }

    // public preload() {

    // }

    public create() {
        let textStyle = {alight: "center", fill: "blue", font: "45px Arial", stroke: "blue"};

        let balanceText = this.game.add.text(500, this.game.world.centerY - 100, "Balance", textStyle);
        balanceText.anchor.set(0.5);

        // let betText = this.game.add.text(500, 1000, `Bet: ${this.stake.bet}` , textStyle);

        // this.stake.registerDrawable({
        //     draw(model) {
        //         betText.setText(`Bet: ${model.bet}`);
        //     }
        // });

    }

    // public update() {

    // }

    public updateBalance() {
        // this.balanceText.setText('Balance:')
    }
}
