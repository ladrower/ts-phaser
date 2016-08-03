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
    protected offset: number;
    protected y: number;
    protected isStarting: boolean = false;
    protected isStarted: boolean = false;
    protected rate: number;
    protected lastUpdateTime: number;

    public get isRunning() {
        return this.isStarting || this.isStarted;
    }

    constructor(
        protected game: Phaser.Game,
        protected spriteName: string,
        protected framesNumber: number,
        protected blurFilterId: string,
        protected maxBlurValue = 15
    ) {}

    public create(baseX: number, baseY: number, window: Phaser.Graphics, offset: number, itemsNumber = 3) {
        this.baseX = baseX;
        this.baseY = baseY;
        this.y = baseY;
        this.window = window;
        this.offset = offset;
        this.blurFilter = <IBlurFilter> this.game.add.filter(this.blurFilterId);
        this.blurFilter.blur = 0;
        this.blurFilter.padding = 10;

        for (let i = 0; i < itemsNumber; i++) {
            let dy = offset * i;
            let item = new ReelItem(this.game, baseX, baseY - dy, this.spriteName);
            item.offset = dy;
            item.mask = window;
            item.filters = [this.blurFilter];
            item.frame = this.getRandomFrame();
            this.game.add.existing(item);
            this.items.push(item);
        }
    }

    public start(pixelsPerSecond, accelerationSeconds = 3, accelarationPower = Phaser.Easing.Quartic) {
        let power = (p => {
            switch (p) {
                case Phaser.Easing.Quadratic: return 2;
                case Phaser.Easing.Cubic: return 3;
                case Phaser.Easing.Quartic: return 4;
                case Phaser.Easing.Quintic: return 5;
            }
            throw "Unsopported easing power passed. Supported: [Quadratic, Cubic, Quartic, Quintic]";
        })(accelarationPower);
        let dS = pixelsPerSecond / Phaser.Timer.SECOND;
        let duration = accelerationSeconds * Phaser.Timer.SECOND;
        let c = dS / (1 - Math.pow((duration - 1) / duration, power));
        if (!this.isStarting) {
            this.isStarting = true;
            this.game.add.tween(this)
                .to( { y: this.y + c },
                     Phaser.Timer.SECOND * accelerationSeconds,
                     accelarationPower.In, true)
            .onUpdateCallback((tween, percent) => {
                this.update(percent * this.maxBlurValue);
            })
            .onComplete.addOnce(() => {
                this.rate = pixelsPerSecond;
                this.isStarted = true;
                this.lastUpdateTime = this.game.time.now;
            });
        }
    }

    public stop(finalFrameNumber: number) {
        if (this.isStarted) {

            this.update();

            let topItem = <ReelItem> this.items[0];

            this.items.forEach((item: ReelItem) => {
                if (item.offset > topItem.offset) {
                    topItem = item;
                }
            });

            topItem.frame = finalFrameNumber;

            let dy = this.baseY - (this.y - topItem.offset);

            this.game.add.tween(this)
                .to( { y: this.y + dy },
                     Phaser.Timer.SECOND * 1, // TODO: calculate duration to start from current rate
                     Phaser.Easing.Elastic.Out, true)
            .onUpdateCallback((tween, percent) => {
                this.update((1 - percent) * this.maxBlurValue);
            })
            .onComplete.addOnce(() => {
                // 
            });


            this.isStarted = false;
            this.isStarting = false;
        } else if (this.isStarting) {
            // 
        }
    }

    public onUpdate() {
        if (this.isStarted) {
            this.y += this.rate * (this.game.time.now - this.lastUpdateTime) / Phaser.Timer.SECOND;
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
