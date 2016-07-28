import {basic as cfg} from "../config";

export default class Boot extends Phaser.State {

    public init() {
        this.stage.backgroundColor = cfg.STAGE.COLOR;
    }

    public create() {
        let {STAGE} = cfg;

        this.scale.setGameSize(STAGE.WIDTH, STAGE.HEIGHT);
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.windowConstraints.bottom = "visual";

        this.scale.onSizeChange.addOnce(() => this.game.state.start("Preload"));
    }
}
