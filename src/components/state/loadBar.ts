export default class StateLoadBar {
    protected stateLoaded: boolean = false;
    protected preloadingStartTime: number;

    constructor(protected state: Phaser.State, protected dictionary, protected animationMinTime: number = 2000 + Math.random() * 3000) {}

    public onPreloadStart () {
        this.preloadingStartTime = this.state.time.now;
    }

    public onPreloadComplete (loadingDebounce = 0) {
        let loadTime = this.state.time.now - this.preloadingStartTime;
        this.state.time.events.add(
            loadTime > loadingDebounce + this.animationMinTime ? 0 : this.animationMinTime - loadTime + loadingDebounce,
            () => this.stateLoaded = true
        );
    }

    public processLoading(onComplete: Function) {
        let tweenInterval = [0, 0.9];
        let loadBar = this.state.add.graphics(0, this.state.game.height - 50)
            .lineStyle(5, 0xffffff, 1)
            .moveTo(0, 0)
            .lineTo(this.state.game.width, 0);

        loadBar.scale.x = tweenInterval[0];

        let loadText = this.state.game.add.text(this.state.world.centerX, this.state.game.height - 100, this.dictionary.loading, {
            alight: "center",
            fill: "#FFF",
            font: "45px Arial",
            stroke: "#FFF",
        });
        loadText.anchor.set(0.5);

        let progressTween = this.state.add.tween(loadBar.scale)
            .to( { x: tweenInterval[1] }, 3000, Phaser.Easing.Quadratic.InOut, true)
            .onUpdateCallback(() => {
                if (this.stateLoaded) {
                    let fadeOutTween = this.state.add.tween((g => g.addMultiple([loadBar, loadText]) && g)(this.state.add.group()))
                        .to( { alpha: 0 }, 500);
                    progressTween.stop();
                    this.state.add.tween(loadBar.scale)
                        .to( { x: 1 }, 500, Phaser.Easing.Quadratic.In, true)
                        .chain(fadeOutTween);
                    fadeOutTween.delay(500).onComplete.add(onComplete);
                } else if (loadBar.scale.x >  tweenInterval[0] + (tweenInterval[1] - tweenInterval[0]) / 2 ) {
                    tweenInterval[0] = loadBar.scale.x;
                    progressTween.timeScale /= 2;
                }
            });
    }
}
