export class ModalPage {
  constructor(element) {
    console.assert(element.length === 1);
    this.element = element;
    this.page = element.find(".page");
  }

  setContent(content) {
    this.page.empty();
    this.page.append(content);
  }

  hide() {
    this.element.addClass("hidden");
  }

  show() {
    this.page.empty();
    this.element.removeClass("hidden");
  }
}


export class Service {
  constructor(service) {
    this.name = service.title;
  }

  render() {
    return [
      new PageTitle(this.name).render(),
    ];
  }
}

class PageTitle {
  pageTitleTemplate = $(".styles .page-title").first();

  constructor(title) {
    this.element = this.pageTitleTemplate.clone();
    this.element.text(title);
  }

  render() {
    return this.element;
  }
}
