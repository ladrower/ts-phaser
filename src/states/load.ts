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
            () => this.load.isLoading || config.GAME.AUDIO.some(({key}) => !this.cache.isSoundDecoded(key))
                ? this.loadBar.processLoading(() => this.start())
                : this.start()
        );
    }

    public preload() {
        this.loadBar.onPreloadStart();

        this.load.atlas(config.GAME.ATLAS_SPRITE.key, config.GAME.ATLAS_SPRITE.url.texture, config.GAME.ATLAS_SPRITE.url.atlas);
        this.load.atlas(config.GAME.CARDS_SPRITE.key, config.GAME.CARDS_SPRITE.url.texture, config.GAME.CARDS_SPRITE.url.atlas);
        config.GAME.AUDIO.forEach(audio => {
            this.load.audio(audio.key, audio.urls, true);
        });
        // Just to try some cool webgl filters
        this.load.script("filter", "https://cdn.rawgit.com/photonstorm/phaser/master/filters/CheckerWave.js");
    }

    public create() {
        this.sound.setDecodedCallback(config.GAME.AUDIO.map(({key}) => key), () => {
            this.loadBar.onPreloadComplete(Load.loadBarDebounce);
        }, this);
    }

    public start() {
        this.game.state.start("Tutorial");
    }
}
