import "../filters/myBlurY";
import IBlurFilter from "../interfaces/IBlurFilter";
import {Promise} from "es6-promise";

let ReelException = {
    AlreadyStarted: class extends Error { public name = "AlreadyStartedException"; },
    AlreadyStopped: class extends Error { public name = "AlreadyStoppedException"; },
    UnsopportedAccelarationPower: class extends Error { public name = "UnsopportedAccelarationPowerException"; },
};

class ReelItem extends Phaser.Sprite {
    public offset: number;
}

export default class Reel {
    public static Exception = ReelException;
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
    protected startPromise: Promise<any>;
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

    public create(baseX: number, baseY: number, window: Phaser.Graphics, offset: number, stopYOffset = 0, itemsNumber = 3): Reel {
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
        return this;
    }

    public start(pixelsPerSecond = 1000, accelerationSeconds = 1, accelarationPower = 4): Promise<any> {
        if (!this.isRunning) {
            let Easing = (p => {
                switch (p) {
                    case 2: return Phaser.Easing.Quadratic;
                    case 3: return Phaser.Easing.Cubic;
                    case 4: return Phaser.Easing.Quartic;
                    case 5: return Phaser.Easing.Quintic;
                }
                throw new ReelException.UnsopportedAccelarationPower("Unsopported accelaration power passed. Supported: [2, 3, 4, 5]");
            })(accelarationPower);
            let dS = pixelsPerSecond / Phaser.Timer.SECOND;
            let duration = accelerationSeconds * Phaser.Timer.SECOND;
            let c = dS / (1 - Math.pow((duration - 1) / duration, accelarationPower));
            let lastY = this.y;

            this.lastUpdateTime = this.game.time.now;
            this.isStarting = true;

            this.startPromise = new Promise((resolve) => {
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
                    this.startPromise = null;
                    this.isStarting = false;
                    this.isStarted = true;
                    this.velocity = pixelsPerSecond;
                    this.lastUpdateTime = this.game.time.now;

                    resolve();
                });
            });

            return this.startPromise;
        }

        throw new ReelException.AlreadyStarted("Start method was already called");
    }

    public stop(finalFrameNumber: number): Promise<any> {
        if (this.isStarted && !this.isStopping) {
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

            return new Promise((resolve) => {
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

                        resolve();
                    });
                });
            });
        } else if (this.isStarting) {
            return this.startPromise.then(() => this.stop(finalFrameNumber));
        }

        throw new ReelException.AlreadyStopped("Stop method was already called");
    }

    public onUpdate() {
        if (this.isStarted) {
            this.y += this.velocity * (this.game.time.now - this.lastUpdateTime) / Phaser.Timer.SECOND;
            this.lastUpdateTime = this.game.time.now;
            this.update(void(0), true);
        }
    }

    public getTopVisibleItem(): Phaser.Sprite {
        let visibleItems = this.items
            .filter(item => item.y >= this.baseY + this.stopYOffset)
            .sort((a, b) => a.y - b.y);
        return visibleItems.length ? visibleItems[0] : null;
    }

    protected update(blur?: number, reset = false) {
        let deadlineY = this.window.y + this.window.height;
        let count = this.items.length;
        this.items.forEach((item: ReelItem, i) => {
            let itemOffset = item.offset;
            let itemY = this.y - itemOffset;
            if (itemY > deadlineY) {
                let gap = itemY - deadlineY;
                let ajustment = count * this.offset;
                itemOffset += ajustment * Math.ceil(gap / ajustment);
                itemY = this.y - itemOffset;
                item.frame = this.getRandomFrame();
            }
            if (reset) {
                itemOffset -= this.y;
                itemY = -itemOffset;
            }
            item.y = itemY;
            item.offset = itemOffset;
        });
        if (reset) {
            this.y = 0;
        }
        if (blur !== undefined && blur !== this.blurFilter.blur) {
            this.blurFilter.blur = blur;
        }
    }

    protected getRandomFrame(): number {
        return Math.round(Math.random() * (this.framesNumber - 1));
    }
}
