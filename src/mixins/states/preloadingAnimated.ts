export default (superclass: typeof Phaser.State) => class PreloadingAnimated extends superclass {
  protected isPreloaded: boolean = false;
  protected preloadingStartTime: number;
  protected animationMinTime: number = 3000;

  protected p0: Phaser.Point;
  protected p1: Phaser.Point;
  protected p2: Phaser.Point;
  protected p3: Phaser.Point;

  protected graphics1: Phaser.Graphics;
  protected graphics2: Phaser.Graphics;
  protected graphics3: Phaser.Graphics;

  protected circleParams = {
    color1: 0xffff00,
    color2: 0xff0000,
    color3: 0x0000ff,
    diameter: 50,
    distance: 200,
    opacity: 1,
  };

  protected startPreLoading() {
    this.preloadingStartTime = this.time.now;
  }

  protected onPreLoadComplete(onComplete: Function) {
    let loadTime = this.time.now - this.preloadingStartTime;
    setTimeout(() => {
        this.finishAnimation(onComplete);
    }, loadTime > this.animationMinTime ? 0 : this.animationMinTime - loadTime);
  }

  protected finishAnimation(onComplete: Function) {
    let fadeOutTime = 2000;

    this.isPreloaded = true;
    this.add.tween(this.p1)
        .to( { x: this.p0.x, y: this.p0.y }, fadeOutTime, Phaser.Easing.Exponential.Out, true);
    this.add.tween(this.p2)
        .to( { x: this.p0.x, y: this.p0.y }, fadeOutTime, Phaser.Easing.Exponential.Out, true);
    this.add.tween(this.p3)
        .to( { x: this.p0.x, y: this.p0.y }, fadeOutTime, Phaser.Easing.Exponential.Out, true);

    this.add.tween(this.circleParams)
        .to({ opacity: 0 }, fadeOutTime, Phaser.Easing.Exponential.In, true)
        .onComplete.add(onComplete);
  }

  public create() {
    super.create();

    this.p0 = new Phaser.Point(this.world.centerX, this.world.centerY);
    this.p1 = new Phaser.Point(this.p0.x + this.circleParams.distance, this.p0.y);
    this.p2 = new Phaser.Point(this.p0.x + this.circleParams.distance, this.p0.y);
    this.p3 = new Phaser.Point(this.p0.x + this.circleParams.distance, this.p0.y);

    this.p1.rotate(this.p0.x, this.p0.y, 30, true);
    this.p2.rotate(this.p0.x, this.p0.y, 150, true);
    this.p3.rotate(this.p0.x, this.p0.y, 270, true);

    this.graphics1 = this.add.graphics(this.p1.x, this.p1.y);
    this.graphics1.beginFill(this.circleParams.color1);
    this.graphics1.drawCircle(0, 0, this.circleParams.diameter);
    this.graphics1.endFill();

    this.graphics2 = this.add.graphics(this.p2.x, this.p2.y);
    this.graphics2.beginFill(this.circleParams.color2);
    this.graphics2.drawCircle(0, 0, this.circleParams.diameter);
    this.graphics2.endFill();

    this.graphics3 = this.add.graphics(this.p3.x, this.p3.y);
    this.graphics3.beginFill(this.circleParams.color3);
    this.graphics3.drawCircle(0, 0, this.circleParams.diameter);
    this.graphics3.endFill();
  }

  public update() {
    super.update();

    if (this.isPreloaded) {
        this.graphics1.clear();
        this.graphics1.beginFill(this.circleParams.color1, this.circleParams.opacity);
        this.graphics1.drawCircle(0, 0, this.circleParams.diameter);
        this.graphics1.endFill();

        this.graphics2.clear();
        this.graphics2.beginFill(this.circleParams.color2, this.circleParams.opacity);
        this.graphics2.drawCircle(0, 0, this.circleParams.diameter);
        this.graphics2.endFill();

        this.graphics3.clear();
        this.graphics3.beginFill(this.circleParams.color3, this.circleParams.opacity);
        this.graphics3.drawCircle(0, 0, this.circleParams.diameter);
        this.graphics3.endFill();
    } else {
        let scale1 = 1 + Math.abs(Math.sin(this.p1.angle(this.p0)));
        let scale2 = 1 + Math.abs(Math.sin(this.p2.angle(this.p0)));
        let scale3 = 1 + Math.abs(Math.sin(this.p3.angle(this.p0)));

        let angle = 4;

        this.p1.rotate(this.p0.x, this.p0.y, angle, true);
        this.p2.rotate(this.p0.x, this.p0.y, angle, true);
        this.p3.rotate(this.p0.x, this.p0.y, angle, true);

        this.graphics1.scale.set(scale1, scale1);
        this.graphics2.scale.set(scale2, scale2);
        this.graphics3.scale.set(scale3, scale3);
    }

    this.graphics1.x = this.p2.x;
    this.graphics1.y = this.p1.y;

    this.graphics2.x = this.p1.x;
    this.graphics2.y = this.p2.y;

    this.graphics3.x = (this.p1.x + this.p2.x) / 2;
    this.graphics3.y = this.p3.y;
  }
};
