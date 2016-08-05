
import {basic as config} from "../config";
import Game from "../game";
import Slots from "../models/slots";
import Stake from "../models/stake";
import ReelComponent from "../components/reel";

export default class Play extends Phaser.State {
    protected slots: Slots;
    protected reel: ReelComponent;
    protected cardsGroup: Phaser.Group;

    public game: Game;

    public init() {
        this.reel = new ReelComponent(this.game, config.GAME.CARDS_SPRITE, config.GAME.CARDS_NUMBER, "MyBlurY");
        this.slots = new Slots(
            new Stake(null, 1)
        );
    }

    public create() {
        this.createCards();
        this.createReel();

        let textStyle = {alight: "center", fill: "#fff", font: "80px Arial", stroke: "#000"};

        let balanceText = this.game.add.text(this.cardsGroup.centerX, this.cardsGroup.top - 100, "Balance", textStyle);
        balanceText.anchor.set(0.5, 1);


        let betText = this.game.add.text(this.cardsGroup.centerX, this.cardsGroup.bottom + 100, null , textStyle);
        betText.anchor.set(0.5, 0);

        this.slots.stake.registerDrawer((model: Stake, changedProps) => {
            changedProps.forEach(prop => {
                switch (prop) {
                    case "bet":
                        betText.setText(`${this.game.myLocale.bet}: ${model.bet}`);
                        break;
                    case "symbol": {
                        let frame = config.GAME.CARDS_FRAMES_MAP[model.symbol];
                        this.cardsGroup.children.forEach((card: Phaser.Button) => {
                            if (card.frame === frame) {
                                card.tint = 0x0000ff;
                            } else {
                                card.tint = 0xffffff;
                            }
                        });

                        break;
                    }
                }
            });
        });

        this.slots.registerDrawer((model: Slots, changedProps) => {
            balanceText.setText(`${this.game.myLocale.balance}: ${model.balance}`);
        });

        this.slots.draw(["stake", "balance"]);

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
        this.cardsGroup.onChildInputUp.add((b) => {
            b.tint = 0xffffff;
            this.onCardClick(b);
        });
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

        try {
            this.reel.start(1000 + Math.random() * 500, 0.5);
        } catch (e) { ; }


        this.slots.stake.symbol = this.getFrameSymbol(card.frame);
        this.slots.spin().then((data) => {
            console.log(data);
            let frame = config.GAME.CARDS_FRAMES_MAP[data.spinResult[2]];

            try {
                this.reel.stop(frame).then(() => {
                    this.toggleInput(true);
                    this.slots.stake.symbol = null;
                    this.slots.balance += data.totalWin;
                });
            } catch (e) { ; }

        }).catch(() => {
            console.log("error");
        });
        this.toggleInput(false);
    }

    protected getFrameSymbol(frameNumber: number) {
        let map = config.GAME.CARDS_FRAMES_MAP;
        let symbols = Object.keys(map);
        for (let i = 0; i < symbols.length; i++) {
            if (map[symbols[i]] === frameNumber) {
                return symbols[i];
            }
        }
        throw new Error("Unknown frame");
    }

    protected toggleInput(enabled: boolean) {
        this.cardsGroup.forEach(b => b.inputEnabled = enabled, this);
        this.cardsGroup.alpha = enabled ? 1 : 0.7;
    }
}
