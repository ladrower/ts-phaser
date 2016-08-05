
import {basic as config} from "../config";
import Game from "../game";
import Stake from "../models/stake";
import ReelComponent from "../components/reel";

export default class Play extends Phaser.State {
    protected stake: Stake;
    protected reel: ReelComponent;
    protected cardsGroup: Phaser.Group;

    public game: Game;

    public init() {
        this.reel = new ReelComponent(this.game, config.GAME.CARDS_SPRITE, config.GAME.CARDS_NUMBER, "MyBlurY");
        this.stake = new Stake(null, 1);
    }

    public create() {
        let textStyle = {alight: "center", fill: "#fff", font: "80px Arial", stroke: "#000"};

        let balanceText = this.game.add.text(this.world.centerX, this.world.centerY, "Balance", textStyle);
        balanceText.anchor.set(0.5);


        balanceText.inputEnabled = true;
        balanceText.events.onInputDown.add(() => {
            if (this.reel.isRunning) {
                try {
                    this.reel.stop(0).then(() => this.cardsGroup.alpha = 1);
                } catch (e) { console.error(e); }
            } else {
                this.reel.start(1200, 0.5);
                this.cardsGroup.alpha = 0.5;
            }
        });


        this.createCards();

        let betText = this.game.add.text(50 + this.cardsGroup.centerX, this.cardsGroup.bottom + 100, null , textStyle);
        betText.anchor.set(0.5, 0);

        this.stake.registerDrawer((model: Stake, changedProps) => {
            changedProps.forEach(prop => {
                switch (prop) {
                    case "bet":
                        betText.setText(`${this.game.myLocale.bet}: ${model.bet}`);
                        break;
                    case "symbol":
                        // 
                        break;
                }
            });
        });
        this.stake.draw(["bet", "symbol"]);

        this.createReel();
    }

    protected createCards() {
        this.cardsGroup = this.add.group();
        this.cardsGroup.inputEnableChildren = true;
        for (let i = 0; i < config.GAME.CARDS_NUMBER; i++) {
            let b = this.add.button(50, this.world.centerY, config.GAME.CARDS_SPRITE);
            b.frame = i;
            b.anchor.set(0, 0.5);
            b.x += (b.width + 50) * i;
            this.cardsGroup.add(b);
            b.onInputUp.add((r) => console.log(r));
        }
        this.cardsGroup.onChildInputOver.add((b) => {
            b.tint = 0xff00ff;
        });
        this.cardsGroup.onChildInputOut.add((b) => {
            b.tint = 0xffffff;
        });
        this.cardsGroup.onChildInputDown.add((b) => {
            b.tint = 0x0000ff;
        });
        this.cardsGroup.onChildInputUp.add(this.onCardClick, this);
    }

    protected createReel() {
        let reelWindow = this.add.graphics(this.world.width - 300, this.world.height / 2 - 128);
        reelWindow.beginFill(0xffffff);
        reelWindow.drawRect(0, 0, 256, 256);

        this.reel.create(this.world.width - 300, this.world.height / 2 - 128, reelWindow, 300);
    }

    public update() {
        this.reel.onUpdate();
    }

    protected onCardClick(card) {
        console.log(card.frame);
        // this.cardsGroup.forEach(b => b.inputEnabled = false, this);
        this.cardsGroup.alpha = 0.5;
    }
}
