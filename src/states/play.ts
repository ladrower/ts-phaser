
import {basic as config} from "../config";
import Game from "../game";
import Slots from "../models/slots";
import Stake from "../models/stake";
import ReelComponent from "../components/reel";

export default class Play extends Phaser.State {
    protected slots: Slots;
    protected reel: ReelComponent;
    protected cardsGroup: Phaser.Group;
    protected decrementBtn: Phaser.Button;
    protected incrementBtn: Phaser.Button;
    protected reelAudio: Phaser.Sound;
    protected bigwinAudio: Phaser.Sound;
    protected regwinAudio: Phaser.Sound;

    public game: Game;

    public init() {
        this.reel = new ReelComponent(this.game, config.GAME.CARDS_SPRITE.key, config.GAME.CARDS_NUMBER, "MyBlurY");
        this.slots = new Slots(
            new Stake(null, 1)
        );
    }

    public create() {
        this.createCards();
        this.createReel();
        this.createBetButtons();
        this.createAudio();
        this.toggleInput(true);

        let textStyle = {alight: "center", fill: "#fff", font: "80px Arial", stroke: "#000"};

        let balanceText = this.add.text(this.cardsGroup.centerX, this.cardsGroup.top - 100, "Balance", textStyle);
        balanceText.anchor.set(0.5, 1);


        let betText = this.add.text(this.cardsGroup.centerX, this.cardsGroup.bottom + 100, null , textStyle);
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

    public update() {
        this.reel.onUpdate();
    }

    protected createCards() {
        this.cardsGroup = this.add.group();
        this.cardsGroup.inputEnableChildren = true;
        for (let i = 0; i < config.GAME.CARDS_NUMBER; i++) {
            let b = this.add.button(50 + 128, this.world.centerY, config.GAME.CARDS_SPRITE.key);
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
        let reelWindow = this.add.graphics(this.world.width - 384 - 50, this.world.height / 2 - 128);
        reelWindow.beginFill(0xffffff);
        reelWindow.drawRect(0, 0, 256, 256);
        reelWindow.alpha = 0;

        this.reel.create(this.world.width - 384 - 50, this.world.height / 2 - 128, reelWindow, 300);
    }

    protected createBetButtons() {
        this.decrementBtn = this.add.button(this.cardsGroup.centerX - 200, this.cardsGroup.bottom + 80, config.GAME.ATLAS_SPRITE.key,
        () => {
            if (this.slots.stake.bet !== config.GAME.BET_RANGE[0]) {
                this.slots.stake.bet--;
                this.toggleBetInput(true);
            }
        });
        this.decrementBtn.anchor.set(0.5, 0);
        this.decrementBtn.frameName = "minus-icon.png";

        this.incrementBtn = this.add.button(this.cardsGroup.centerX + 200, this.cardsGroup.bottom + 80, config.GAME.ATLAS_SPRITE.key,
        () => {
            if (this.slots.stake.bet !== config.GAME.BET_RANGE[1]) {
                this.slots.stake.bet++;
                this.toggleBetInput(true);
            }
        });
        this.incrementBtn.anchor.set(0.5, 0);
        this.incrementBtn.frameName = "plus-icon.png";
    }

    protected createAudio() {
        this.reelAudio = this.add.audio(config.GAME.AUDIO_KEY.REEL);
        this.bigwinAudio = this.add.audio(config.GAME.AUDIO_KEY.BIG_WIN);
        this.regwinAudio = this.add.audio(config.GAME.AUDIO_KEY.REG_WIN);
    }

    protected onCardClick(card) {
        try {
            this.reel.start(1000 + Math.random() * 500, 0.5);
            this.reelAudio.fadeIn(1000);
            this.reelAudio.loopFull();
        } catch (e) { ; }

        this.slots.stake.symbol = this.getFrameSymbol(card.frame);
        this.slots.spin().then(data => {
            let frame = config.GAME.CARDS_FRAMES_MAP[data.spinResult[2]];
            try {
                this.reel.stop(frame).then(() => {
                    let onComplete = () => {
                        this.toggleInput(true);
                        this.slots.stake.symbol = null;
                        this.slots.balance += data.totalWin;
                    };

                    if (data.winType !== config.GAME.WIN_TYPE.NONE) {
                        let item = this.reel.getTopVisibleItem();
                        let mask = item.mask;
                        item.mask = null;
                        item.anchor.set(0.5);
                        item.x += item.width / 2;
                        item.y += item.height / 2;
                        this.add.tween(item.scale).to({x: 2, y: 2}, 750, Phaser.Easing.Cubic.InOut, true, 0, 1, true)
                            .onComplete.add(() => {
                                onComplete();
                                item.mask = mask;
                                item.anchor.set(0);
                                item.x -= item.width / 2;
                                item.y -= item.height / 2;
                            });
                        if (data.winType === config.GAME.WIN_TYPE.BIG) {
                            this.animateBigWin(data.totalWin, 2000, 500);
                        } else {
                            this.animateRegWin(data.totalWin, 3000);
                        }
                    } else {
                        onComplete();
                    }
                });
                this.reelAudio.fadeOut(1000);
            } catch (e) { ; }

        }).catch(error => {
            this.reel.stop(-1).then(() => this.toggleInput(true));
            this.reelAudio.stop();
            alert("Server error occurred. Please try again.");
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
        this.cardsGroup.forEach(b => {
            b.inputEnabled = enabled;
            if (enabled) {
                b.input.useHandCursor = true;
            }
        }, this);
        this.cardsGroup.alpha = enabled ? 1 : .5;
        this.toggleBetInput(enabled);
    }

    protected toggleBetInput(enabled: boolean) {
        let decEnabled = this.slots.stake.bet === config.GAME.BET_RANGE[0] ? false : enabled;
        let incEnabled = this.slots.stake.bet === config.GAME.BET_RANGE[1] ? false : enabled;

        this.decrementBtn.inputEnabled = decEnabled;
        this.decrementBtn.alpha = decEnabled ? 1 : .5;
        if (decEnabled) {
            this.decrementBtn.input.useHandCursor = true;
        }

        this.incrementBtn.inputEnabled = incEnabled;
        this.incrementBtn.alpha = incEnabled ? 1 : .5;
        if (incEnabled) {
            this.incrementBtn.input.useHandCursor = true;
        }
    }

    protected animateBigWin(totalWin: number, duration: number, delay: number) {
        let win = {count: 1};
        let winText = this.add.text(this.world.centerX, this.world.centerY, win.count.toString(), {
            alight: "center",
            fill: "#fff",
            font: "200px Arial",
            stroke: "#000",
        });
        duration = Math.max(500, duration);
        winText.anchor.set(0.5);
        this.bigwinAudio.fadeIn(500);
        this.add.tween(winText.scale).to({x: 3, y: 3}, duration, Phaser.Easing.Quadratic.In, true, delay);
        this.add.tween(win).to({count: totalWin}, duration, Phaser.Easing.Quadratic.In, true, delay)
            .onUpdateCallback(() => winText.setText(win.count.toFixed(0)))
            .onComplete.addOnce(() => {
                this.time.events.add(500, () => winText.destroy());
                this.bigwinAudio.fadeOut(500);
            });
    }

    protected animateRegWin(totalWin: number, duration: number) {
        this.regwinAudio.fadeIn(500);
        this.time.events.add(Math.max(500, duration), () => this.regwinAudio.fadeOut(500));
    }
}
