export class BlockPreWrap {
  constructor(content) {
    this.$element = $(".components .paragraph--prewrap").clone();
    this.$element.empty().append(content);
  }

  render() {
    return this.$element;
  }
}
