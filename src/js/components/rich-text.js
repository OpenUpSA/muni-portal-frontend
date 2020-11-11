export class ExpandableRichText {
  constructor(html) {
    this.$template = $(".styles .expandable-rich-text");
    this.$element = this.$template.clone();
    this.$contentContainer = this.$element.find(".rich-text");
    this.$gradientContainer = this.$element.find(".rich-text__gradient");
    this.$openButton = this.$element.find(".expand-toggle__content-first");
    this.$closeButton = this.$element.find(".expand-toggle__content-last");

    // Interactions
    this.$openButton.on(
      "click",
      (() => {
        this.$contentContainer.addClass("expanded");
        this.$gradientContainer.addClass("expanded");
        this.$openButton.addClass("expanded");
      }).bind(this)
    );
    this.$closeButton.on(
      "click",
      (() => {
        this.$contentContainer.removeClass("expanded");
        this.$gradientContainer.removeClass("expanded");
        this.$openButton.removeClass("expanded");
      }).bind(this)
    );

    // Content
    this.$contentContainer.html(html);
  }

  render() {
    return this.$element;
  }
}
