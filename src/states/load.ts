import {basic as config} from "../config";
import Game from "../game";
import StateLoadBar from "../components/state/loadBar";

/**
 * Playing with composition to add some loading animation
 */
export default class Load extends Phaser.State {
    protected static loadBarDebounce: number = 10; // 500
    protected loadBar: StateLoadBar;

    public game: Game;

    public init() {
        this.loadBar = new StateLoadBar(this, this.game.myLocale);
        this.time.events.add(Load.loadBarDebounce,
            () => this.load.isLoading
                ? this.loadBar.processLoading(() => this.start())
                : this.start()
        );
    }

    public preload() {
        this.loadBar.onPreloadStart();

        this.load.atlas(config.GAME.ATLAS_SPRITE, "./assets/sprites/atlas.png", "./assets/sprites/atlas.json");
        this.load.atlas(config.GAME.CARDS_SPRITE, "./assets/sprites/letters.png", "./assets/sprites/letters.json");
        // Just to try some cool webgl filters
        this.load.script("filter", "https://cdn.rawgit.com/photonstorm/phaser/master/filters/CheckerWave.js");
    }

    public create() {
        this.loadBar.onPreloadComplete(Load.loadBarDebounce);
    }

    public start() {
        this.game.state.start("Tutorial");
    }
}
