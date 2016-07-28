
import Base from "./base";



interface IDrawable {
    foo();
}

let Drawable = (superclass: typeof Base) => class extends superclass implements IDrawable {
  public foo() {
    console.log("foo from MyMixin");
  }
};

let Drawable2 = (superclass: new () => IDrawable) => class Drawable2 extends superclass implements IDrawable  {
  public foo() {
    super.foo();
    console.log("foo from MyMixin2");
  }
};

class Some extends Base {

}


class Stake extends Drawable2(Drawable(Some)) {

    constructor(public symbol, public bet) {
        super();
        // this.symbol = symbol;
        // this.bet = bet;
    }

    public foo() {
        super.foo();
        console.log("foo from Stake");
    }


}

let s = new Stake(1, 2);
s.foo();

export default Stake;
