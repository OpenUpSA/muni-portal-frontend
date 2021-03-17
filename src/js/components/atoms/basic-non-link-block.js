export default class BasicNonLinkBlock {
  constructor({ content }) {
    this.$element = $("<div />", { class: "card basic-block" });
    this.$element.append(content);
  }

  render() {
    return this.$element;
  }
}
