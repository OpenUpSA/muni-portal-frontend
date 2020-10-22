export class Breadcrumbs {
  breadcrumbsTemplate = $(".styles .breadcrumbs__wrap").first();

  constructor(items) {
    this.element = this.breadcrumbsTemplate.clone();
    this.itemsContainer = this.element.find(".breadcrumbs");
    this.itemsContainer.empty();
    items.forEach((item) => {
      this.itemsContainer.append(new Breadcrumb(item).render());
    });
  }

  render() {
    return this.element;
  }
}

class Breadcrumb {
  breadcrumbTemplate = $(".styles .breadcrumb").first();

  constructor(item) {
    this.element = this.breadcrumbTemplate.clone();
    this.element.text(item.label);
    this.element.attr("href", item.url);
  }

  render() {
    return this.element;
  }
}
