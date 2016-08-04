import IBlurFilter from "../interfaces/IBlurFilter";
import "../filters/myBlurY";

class ReelItem extends Phaser.Sprite {
    public offset: number;
}

export default class Reel {
    protected items: Phaser.Sprite[] = [];
    protected window: Phaser.Graphics;
    protected blurFilter: IBlurFilter;
    protected baseX: number;
    protected baseY: number;
    protected stopYOffset: number;
    protected offset: number;
    protected y: number;
    protected isStarting: boolean = false;
    protected isStarted: boolean = false;
    protected isStopping: boolean = false;
    protected velocity: number = 0;
    protected lastUpdateTime: number;

    public get isRunning() {
        return this.isStarting || this.isStarted || this.isStopping;
    }

    constructor(
        protected game: Phaser.Game,
        protected spriteName: string,
        protected framesNumber: number,
        protected blurFilterId: string,
        protected maxBlurValue = 15
    ) {}

    public create(baseX: number, baseY: number, window: Phaser.Graphics, offset: number, stopYOffset = 0, itemsNumber = 3) {
        this.baseX = baseX;
        this.baseY = baseY;
        this.stopYOffset = stopYOffset;
        this.y = baseY + stopYOffset;
        this.window = window;
        this.offset = offset;
        this.blurFilter = <IBlurFilter> this.game.add.filter(this.blurFilterId);
        this.blurFilter.blur = 0;
        this.blurFilter.padding = 10;

        for (let i = 0; i < itemsNumber; i++) {
            let dy = offset * i;
            let item = new ReelItem(this.game, this.baseX, this.y - dy, this.spriteName);
            item.offset = dy;
            item.mask = window;
            item.filters = [this.blurFilter];
            item.frame = this.getRandomFrame();
            this.game.add.existing(item);
            this.items.push(item);
        }
    }

    public start(pixelsPerSecond = 1000, accelerationSeconds = 1, accelarationPower = 4) {
        if (!this.isRunning) {
            console.log("starting");
            let Easing = (p => {
                switch (p) {
                    case 2: return Phaser.Easing.Quadratic;
                    case 3: return Phaser.Easing.Cubic;
                    case 4: return Phaser.Easing.Quartic;
                    case 5: return Phaser.Easing.Quintic;
                }
                throw "Unsopported accelaration power passed. Supported: [2, 3, 4, 5]";
            })(accelarationPower);
            let dS = pixelsPerSecond / Phaser.Timer.SECOND;
            let duration = accelerationSeconds * Phaser.Timer.SECOND;
            let c = dS / (1 - Math.pow((duration - 1) / duration, accelarationPower));
            let lastY = this.y;

            this.lastUpdateTime = this.game.time.now;
            this.isStarting = true;
            this.game.add.tween(this)
                .to( { y: this.y + c },
                     Phaser.Timer.SECOND * accelerationSeconds,
                     Easing.In, true)
            .onUpdateCallback((tween, percent) => {
                let diffY = this.y - lastY;
                lastY = this.y;
                this.update(percent * this.maxBlurValue);
                this.velocity = diffY / (this.game.time.now - this.lastUpdateTime) * Phaser.Timer.SECOND;
                this.lastUpdateTime = this.game.time.now;
            })
            .onComplete.addOnce(() => {
                if (this.isStarting) {
                    this.isStarting = false;
                    this.isStarted = true;
                    this.velocity = pixelsPerSecond;
                    this.lastUpdateTime = this.game.time.now;
                }
            });
        }
    }

    public stop(finalFrameNumber: number) {
        if (this.isStarted && !this.isStopping) {
            console.log("stopping");
            this.isStopping = true;
            this.isStarted = false;
            this.isStarting = false;

            this.update();

            let stopItem = <ReelItem> this.items[0];
            this.items.forEach((item: ReelItem) => {
                if (item.offset > stopItem.offset) {
                    stopItem = item;
                }
            });
            stopItem.frame = finalFrameNumber;

            let dy = this.baseY - (this.y - stopItem.offset) + this.stopYOffset;
            let pullY = dy - stopItem.height;

            this.game.add.tween(this)
                .to( { y: this.y + pullY },
                     pullY / this.velocity * Phaser.Timer.SECOND,
                     Phaser.Easing.Linear.None, true)
            .onUpdateCallback(() => this.update())
            .onComplete.addOnce(() => {
                this.game.add.tween(this)
                    .to( { y: this.y + stopItem.height },
                        stopItem.height / this.velocity * Phaser.Timer.SECOND * 10,
                        Phaser.Easing.Elastic.Out, true)
                .onUpdateCallback((tween, percent) => {
                    this.update((1 - percent) * this.maxBlurValue);
                })
                .onComplete.addOnce(() => {
                    this.isStopping = false;
                });
            });


        } else if (this.isStarting) {
            // 
        }
    }

    public onUpdate() {
        if (this.isStarted) {
            console.log("updating");
            this.y += this.velocity * (this.game.time.now - this.lastUpdateTime) / Phaser.Timer.SECOND;
            this.lastUpdateTime = this.game.time.now;
            this.update();
        }
    }

    protected update(blur?: number) {
        let deadlineY = this.window.y + this.window.height;
        let count = this.items.length;
        this.items.forEach((item: ReelItem, i) => {
            let itemY = this.y - item.offset;
            if (itemY > deadlineY) {
                let gap = itemY - deadlineY;
                let ajustment = count * this.offset;
                item.offset += ajustment * Math.ceil(gap / ajustment);
                itemY = this.y - item.offset;
                item.frame = this.getRandomFrame();
            }

            item.y = itemY;
        });
        if (blur !== undefined && blur !== this.blurFilter.blur) {
            this.blurFilter.blur = blur;
        }
    }

    protected getRandomFrame(): number {
        return Math.round(Math.random() * (this.framesNumber - 1));
    }
}
