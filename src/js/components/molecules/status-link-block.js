export class StatusLinkblock {
  constructor({ href, title, subtitle, status }) {
    this.$element = $(".components .link-block--subtitle-status").clone();
    this.$element.attr("href", href);
    this.$element.find(".h3-block-title").text(title);
    this.$element.find(".subtitle").text(subtitle);
    this.$element.find(".link-block__status").text(status);
  }

  render() {
    return this.$element;
  }
}
