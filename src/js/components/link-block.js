export class LinkBlock {
  constructor(props) {
    this.element = this.template(props).clone();
    this.labelContainer = this.element.find(".h3-block-title");

    this.element.attr("href", props.url);
    this.labelContainer.text(props.title);

    if (props.subjectIconClasses) {
      this.subjectIconContainer = this.element.find(".link-block__icon div");
      this.subjectIconContainer.attr("class", "");
      this.subjectIconContainer.addClass(props.subjectIconClasses);
    }
  }

  template(props) {
    if (props.targetIconClasses &&
        props.subtitle &&
        props.shadedTarget) {
      return $(".styles .link-block:eq(7)");
    } else if (props.targetIconClasses &&
               props.subjectIconClasses &&
               props.subtitle) {
      return $(".styles .link-block:eq(5)");
    } else if (props.targetIconClasses &&
               props.subjectIconClasses) {
      return $(".styles .link-block:eq(3)");
    } else if (props.subjectIconClasses &&
               props.subtitle) {
      return $(".styles .link-block:eq(2)");
    } else {
      return $(".styles .link-block:eq(1)");
    }
  }

  render() {
    return this.element;
  }
}
