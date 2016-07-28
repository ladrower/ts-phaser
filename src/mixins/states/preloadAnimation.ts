export default (superclass: typeof Phaser.State) => class PreloadAnimations extends superclass {
  public foo() {
    console.log("foo from MyMixin");
  }
};
