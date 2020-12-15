export class FullWidthGrid {
  template = $(".styles .grid--fullwidth");

  constructor(children) {
    this.element = this.template.clone();
    console.assert(this.element.length === 1);
    this.element.empty();
    this.element.append(children.map((c) => {
      if (typeof(c.render) === 'function')
        return c.render();
      else
        return c;
    }));
  }

  render() {
    return this.element;
  }
}
