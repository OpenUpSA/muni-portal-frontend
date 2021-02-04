export class BasicBlock {
  constructor(props) {
    this.template = $(".components .basic-block--rich-text");
    this.element = this.template.clone();
    this.element.find(".h3-block-title").text(props.title);

    const contentContainer = this.element.find(".rich-text--basic-block");

    if (props.type === "html") {
      contentContainer.empty().append(props.dangerouslySetInnerHTML);
    } else {
      contentContainer.find("p").text(props.subtitle);
    }
  }

  render() {
    return this.element;
  }
}
