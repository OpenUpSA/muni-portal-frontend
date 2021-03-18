export default class BasicNonLinkBlock {
  constructor({ content }) {
    this.$element = $(".components .card.basic-block:eq(0)").clone();
    this.$element.find(".link-block__inner").empty().append(content);
  }

  render() {
    return this.$element;
  }
}
