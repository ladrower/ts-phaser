
export default class extends Phaser.State {
    public create() {
        let textStyle = {alight: "center",  fill: "blue", font: "45px Arial", stroke: "blue"};

        let title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, "ES2015 Wizard", textStyle);
        title.anchor.set(0.5);

        textStyle.font = "36px Arial";

        let instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '"s" key to start', textStyle);
        instructions.anchor.set(0.5);

        let controlMessage = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 150,
            "use arrow keys to move",
            textStyle);

        controlMessage.anchor.set(0.5);

        let muteMessage = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 225, '"SPACEBAR" to win.', textStyle);
        muteMessage.anchor.set(0.5);

        let sKey = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        sKey.onDown.addOnce( () => this.game.state.start("play"));
    }
}
