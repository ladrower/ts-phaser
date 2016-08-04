import BaseModel from "../../models/base";

interface IDrawer {
  (model: BaseModel, changedProps: Array<string>);
}

interface IDrawable {
    registerDrawer(drawer: IDrawer);
    draw(props: Array<string>);
}

let Drawable = (superclass: typeof BaseModel) => class extends superclass implements IDrawable {
  protected drawers: Array<IDrawer> = [];
  public draw(props) {
    this.drawers.forEach(drawer => drawer(this, props));
  }
  public registerDrawer(drawer: IDrawer) {
    this.drawers.push(drawer);
  }
};

export default Drawable;
