import { sendEvent } from "../utils/analytics";

export class ExpandableRichText {
  constructor(html) {
    this.$template = $(".components .expandable-rich-text");
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
        sendEvent({
          event: "rich-text-expand",
          page: document.location.href,
          type: "rich-text",
        });
      }).bind(this)
    );
    this.$closeButton.on(
      "click",
      (() => {
        this.$contentContainer.removeClass("expanded");
        this.$gradientContainer.removeClass("expanded");
        this.$openButton.removeClass("expanded");
        sendEvent({
          event: "rich-text-collapse",
          page: document.location.href,
          type: "rich-text",
        });
      }).bind(this)
    );

    // Content
    this.$contentContainer.html(html);
  }

  render() {
    return this.$element;
  }
}
