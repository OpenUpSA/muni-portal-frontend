export class LoadingPlaceholder {
  constructor() {
    this.$element = $("<p/>", {
      class: "loading-placeholder",
      text: "Loading...",
    });
  }

  remove() {
    this.$element.remove();
  }

  render() {
    return this.$element;
  }
}
