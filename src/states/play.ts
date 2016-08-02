
import Stake from "../models/stake";


class MySprite extends Phaser.Sprite {
    public offset: number;
}


export default class Play extends Phaser.State {
    public stake: Stake;

    protected items: Phaser.Sprite[] = [];
    protected y: number = 0;

    public init() {


        this.stake = new Stake(null, null);
    }

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

    let mask = this.add.graphics(0, 0);


    mask.beginFill(0xffffff);

    mask.drawCircle(100, 100, 500);

    this.game.input.addMoveCallback(function (pointer, x, y) {
        mask.x = x - 100;
        mask.y = y - 100;
    }, this);

        let d = 300;
        for (let i = 0; i < 3; i++) {
            let a = new MySprite(this.game, 0, 0, "letters");
            this.add.existing(a);
            a.offset = d * i;
            a.mask = mask;
            a.frame = 0;
            this.items.push(a);
        }

        this.add.tween(this).to( { y: 5 * this.world.height }, 20000, Phaser.Easing.Quadratic.InOut, true, 0);

    }

    public update() {
        // this.y += 4;

        this.items.forEach((item: MySprite, i) => {
            item.y = this.y + item.offset;

            if (item.y > this.world.height / 2) {
                let diff = item.y - this.world.height / 2;
                let ajustment = this.items.length * 300;
                item.offset -= ajustment * Math.ceil(diff / ajustment);
                item.y = this.y + item.offset;
                item.frame = Math.round(Math.random() * 3);
            }
        });
    }

    public updateBalance() {
        // this.balanceText.setText('Balance:')
    }
}
