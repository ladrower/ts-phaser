import {basic as cfg} from "../config";
import Game from "../game";
import PreloadingAnimated from "../mixins/states/preloadingAnimated";
/**
 * Playing with mixins to mix in some animation
 */
class Boot extends PreloadingAnimated(Phaser.State) {
    public game: Game;

    public create() {
        super.create();

        this.startPreLoading();
    }

    protected startPreLoading() {
        super.startPreLoading();

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
        super.onPreLoadComplete(() => this.game.state.start("Load"));

        this.game.myLocale = this.cache.getJSON("locale");
    }
}

export default Boot;
