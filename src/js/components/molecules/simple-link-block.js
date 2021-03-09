export class SimpleLinkBlock {
  constructor({ href, title }) {
    this.$element = $(".components a.link-block:eq(0)").clone();
    this.$element.attr("href", href);
    this.$element.find(".h3-block-title").text(title);
  }

  render() {
    return this.$element;
  }
}
