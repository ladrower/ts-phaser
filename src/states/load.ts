import Game from "../game";

export default class Load extends Phaser.State {
    protected static loadingDebounce: number = 500;
    protected isCreated: boolean = false;

    public game: Game;

    public init() {
        this.time.events.add(Load.loadingDebounce,
            () => this.isCreated
                ? this.start()
                : this.processLoading(() => this.start()));
    }

    protected processLoading(onComplete: Function) {
        let tweenInterval = [0, 0.9];
        let loadBar = this.add.graphics(0, this.game.height - 50)
            .lineStyle(5, 0xffffff, 1)
            .moveTo(0, 0)
            .lineTo(this.game.width, 0);

        loadBar.scale.x = tweenInterval[0];

        let loadText = this.game.add.text(this.world.centerX, this.game.height - 100, this.game.myLocale.loading, {
            alight: "center",
            fill: "#FFF",
            font: "45px Arial",
            stroke: "#FFF",
        });
        loadText.anchor.set(0.5);
        // loadText.text = 


        let progressTween = this.add.tween(loadBar.scale)
            .to( { x: tweenInterval[1] }, 3000, Phaser.Easing.Quadratic.InOut, true)
            .onUpdateCallback(() => {
                if (this.isCreated) {
                    let fadeOutTween = this.add.tween((g => g.addMultiple([loadBar, loadText]) && g)(this.add.group()))
                        .to( { alpha: 0 }, 500);
                    progressTween.stop();
                    this.add.tween(loadBar.scale)
                        .to( { x: 1 }, 500, Phaser.Easing.Quadratic.In, true)
                        .chain(fadeOutTween);
                    fadeOutTween.delay(500).onComplete.add(onComplete);
                } else if (loadBar.scale.x >  tweenInterval[0] + (tweenInterval[1] - tweenInterval[0]) / 2 ) {
                    tweenInterval[0] = loadBar.scale.x;
                    progressTween.timeScale /= 2;
                }
            });
    }

    public preload() {
        this.load.image("space", "./assets/images/space.jpg");
    }

    public create() {
        // Delay create. Imitate loading
        this.time.events.add(this.rnd.integerInRange(2000, 5000), () => this.isCreated = true);
    }

    public start() {
        // this.game.state.start("Play");
    }
}
