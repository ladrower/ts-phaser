export default {
    registerDrawable(drawable) {
        this._drawables.push(drawable);
    },

    updateDrawables() {
        this._drawables.forEach(d => d.draw(this));
    },
};
