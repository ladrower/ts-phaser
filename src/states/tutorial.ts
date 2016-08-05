import Game from "../game";

export default class Tutorial extends Phaser.State {
    public game: Game;

    protected wavesFilter: Phaser.Filter;

    public create() {
        this.initControls();
        this.wavesFilter = this.add.filter("CheckerWave", this.world.width, this.world.height);

        let background = this.add.sprite(0, 0);
        background.width = this.world.width;
        background.height = this.world.height;
        background.filters = [this.wavesFilter];

        let textStyle = {alight: "center",  fill: "#fff", font: "100px Arial", stroke: "#000"};

        let title = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY - 100,
            this.game.myLocale.gameTitle,
            textStyle);
        title.anchor.set(0.5);

        textStyle.font = "48px Arial";

        let instructions = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY,
            this.game.myLocale.gameInstructions,
            textStyle);
        instructions.anchor.set(0.5);
    }

    public update() {
        this.wavesFilter.update();
    }

    protected initControls() {
        this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.addOnce(
            () => this.game.state.start("Play")
        );
    }
}
