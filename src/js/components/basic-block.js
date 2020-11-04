export class BasicBlock {
  constructor(props) {
    this.template = $(".styles .basic-block--rich-text");
    this.element = this.template.clone();
    this.element.find(".h3-block-title").text(props.title);
    this.element.find(".rich-text--basic-block p").text(props.subtitle);
  }

  render() {
    return this.element;
  }
}
