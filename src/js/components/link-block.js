export class LinkBlock {
  constructor(props) {
    this.element = this.getTemplate(props).clone();
    console.assert(this.element.length == 1);
    this.labelContainer = this.element.find(".h3-block-title");

    this.element.attr("href", props.url);
    this.labelContainer.text(props.title);

    if (props.subjectIconClasses) {
      this.subjectIconContainer = this.element.find(".link-block__icon div");
      console.assert(this.subjectIconContainer.length == 1);
      this.subjectIconContainer.attr("class", "");
      this.subjectIconContainer.addClass(props.subjectIconClasses);
    }
    if (props.targetIconClasses) {
      this.targetIconContainer = this.element.find(
        ".link-block__action-icon div"
      );
      console.assert(this.targetIconContainer.length == 1);
      this.targetIconContainer.attr("class", "");
      this.targetIconContainer.addClass(props.targetIconClasses);
    }

    if (props.subtitle || props.subtitle === "") {
      this.subtitleContainer = this.element.find(".subtitle");
      console.assert(this.subtitleContainer.length == 1);
      this.subtitleContainer.text(props.subtitle);
    }

    if (props.profileImageThumbnail) {
      this.$profileImageThumbnailImg = this.element.find("img");
      this.$profileImageThumbnailImg.attr({
        src: props.profileImageThumbnail.url,
        alt: props.profileImageThumbnail.alt,
        height: props.profileImageThumbnail.height,
        width: props.profileImageThumbnail.width,
      });
    }
  }

  getTemplate(props) {
    // for some items the `targetIconClasses` property might be an ampty string.
    // Explicitly check for this condition as an empty string will evaluate to `false`
    if (
      (props.targetIconClasses || props.targetIconClasses === "") &&
      props.shadedTarget &&
      props.subtitle
    ) {
      return $(".components .link-block:eq(5)");
    }

    if (props.targetIconClasses && props.subjectIconClasses && props.subtitle) {
      return $(".components .link-block:eq(6)");
    }

    if (props.subjectIconClasses && (props.subtitle || props.subtitle === "")) {
      return $(".components .link-block--icon-left:eq(1)");
    }

    if (props.subtitle && props.profileImageThumbnail) {
      return $(".components .link-block--image-left-action-right");
    }

    if (props.subtitle || props.subtitle === "") {
      return $(".components .link-block:eq(3)");
    }

    if (props.subjectIconClasses) {
      return $(".components .link-block:eq(2)");
    }

    return $(".components .link-block:eq(1)");
  }

  render() {
    return this.element;
  }
}
