import * as config from "./config";
import * as states from "./states/";

export default class Game extends Phaser.Game {

    public myConfig: config.IRemoteConfig;
    public myLocale: any;

    constructor() {
        super(0, 0, Phaser.AUTO, config.basic.STAGE.CONTAINER, null);

        Object.keys(states).forEach(state => this.state.add(state, states[state]));

        this.state.start(config.basic.BOOTSTRAP_STATE);
    }
}

