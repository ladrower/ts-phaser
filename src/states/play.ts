
import Stake from "../models/stake";
import ReelComponent from "../components/reel";

export default class Play extends Phaser.State {
    public stake: Stake;

    protected reel: ReelComponent;

    public init() {
        this.reel = new ReelComponent(this.game, "letters", 4, "MyBlurY");

        this.stake = new Stake(null, null);
    }

    public create() {
        let textStyle = {alight: "center", fill: "blue", font: "45px Arial", stroke: "blue"};

        let balanceText = this.game.add.text(this.world.centerX, this.world.centerY, "Balance", textStyle);
        balanceText.anchor.set(0.5);


        balanceText.inputEnabled = true;
        balanceText.events.onInputDown.add(() => {
            if (this.reel.isRunning) {
                this.reel.stop(1);
            } else {
                this.reel.start(1200, 0.5);
            }
        });

        // let betText = this.game.add.text(500, 1000, `Bet: ${this.stake.bet}` , textStyle);

        // this.stake.registerDrawable({
        //     draw(model) {
        //         betText.setText(`Bet: ${model.bet}`);
        //     }
        // });

    let mask = this.add.graphics(this.world.width - 300, this.world.height / 2 - 128);


    mask.beginFill(0xffffff);

    mask.drawRect(0, 0, 256, 256);

    // this.game.input.addMoveCallback(function (pointer, x, y) {
    //     mask.x = x - 100;
    //     mask.y = y - 100;
    // }, this);

        this.reel.create(this.world.width - 300, this.world.height / 2 - 128, mask, 300);




    }

    public update() {
        this.reel.onUpdate();
    }

    public updateBalance() {
        // this.balanceText.setText('Balance:')
    }
}
