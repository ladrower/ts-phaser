import {basic as cfg} from "../config";
import Game from "../game";
import PreloadAnimation from "../mixins/states/preloadAnimation";

class Boot extends PreloadAnimation(Phaser.State) {
    public game: Game;

    public p0: Phaser.Point;
    public p1: Phaser.Point;
    public p2: Phaser.Point;
    public p3: Phaser.Point;

    public create() {
        this.p0 = new Phaser.Point(this.world.centerX, this.world.centerY);
        this.p1 = new Phaser.Point(0, 0);
        this.p2 = new Phaser.Point(0, 0);
        this.p3 = new Phaser.Point(0, 0);

        this.p2.rotate(this.world.centerX, this.world.centerY, 120, true);
        this.p3.rotate(this.world.centerX, this.world.centerY, 240, true);

        this.startPreLoading();
    }

    protected startPreLoading() {
        this.load.json("config", cfg.API_BASE + cfg.CONFIG_PATH);
        this.load.onFileComplete.add(this.onFileComplete, this);
        this.load.onLoadComplete.addOnce(this.onPreLoadComplete, this);
        this.load.start();
    }

    protected onFileComplete(progress, key, success) {
        if (success) {
            switch (key) {
                case "config": {
                    this.game.myConfig = this.cache.getJSON("config");
                    let {localePath, locale} = this.game.myConfig;
                    this.load.json("locale", cfg.API_BASE + localePath + locale + ".json");
                } break;
            }

        } else {
            this.load.onFileComplete.remove(this.onFileComplete, this);
            this.game.state.start("Loadfail");
        }
    }

    protected onPreLoadComplete() {
        this.game.myLocale = this.cache.getJSON("locale");
        // this.game.state.start("Load");
    }

    public update() {
        let d = Math.abs(Math.sin(this.p1.angle(this.p0))) * (Math.min(this.world.width, this.world.height) / 2 - 100);
        this.p1.rotate(this.world.centerX, this.world.centerY, 2, true, d);
        this.p2.rotate(this.world.centerX, this.world.centerY, 2, true, d);
        this.p3.rotate(this.world.centerX, this.world.centerY, 2, true, d);

    }

    public render() {

        this.game.context.fillStyle = "rgb(255,0,0)";
        this.game.context.fillRect(this.p1.x + 10, this.p1.y + 10, 20, 20);

        this.game.context.fillStyle = "rgb(0,255,0)";
        this.game.context.fillRect(this.p2.x + 10, this.p2.y + 10, 20, 20);

        this.game.context.fillStyle = "rgb(0,0,255)";
        this.game.context.fillRect(this.p3.x + 10, this.p3.y + 10, 20, 20);

    }
}

export default Boot;
