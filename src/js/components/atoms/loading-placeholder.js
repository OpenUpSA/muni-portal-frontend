export class LoadingPlaceholder {
  constructor(placeholderText) {
    this.$element = $("<p/>", {
      class: "loading-placeholder",
      text: placeholderText || "Loading...",
    });
  }

  remove() {
    this.$element.remove();
  }

  render() {
    return this.$element;
  }
}
