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
    this.overview = service.overview;
    this.breadcrumbItems = [{label: "Services", url: "#/services/"}];
  }

  render() {
    return [
      new PageTitle(this.name).render(),
      new Breadcrumbs(this.breadcrumbItems).render(),
      new SectionHeading("Overview").render(),
      new ExpandableRichText(this.overview).render(),
    ];
  }
}

class PageTitle {
  pageTitleTemplate = $(".styles .page-title").first();

  constructor(title) {
    this.element = this.pageTitleTemplate.clone();
    console.assert(this.element.length === 1);
    this.element.text(title);
  }

  render() {
    return this.element;
  }
}

class Breadcrumbs {
  breadcrumbsTemplate = $(".styles .breadcrumbs__wrap").first();

  constructor(items) {
    this.element = this.breadcrumbsTemplate.clone();
    this.itemsContainer = this.element.find(".breadcrumbs");
    this.itemsContainer.empty();
    items.forEach(item => {
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

class SectionHeading {
  template = $(".styles .section-heading").first();

  constructor(heading) {
    this.element = this.template.clone();
    this.element.find(".section-title").text(heading);
  }

  render() {
    return this.element;
  }
}

class ExpandableRichText {
  template = $(".styles .expandable-rich-text");

  constructor(html) {
    this.element = this.template.clone();
    this.contentContainer = this.element.find(".rich-text");
    this.openButton = this.element.find(".expand-toggle__content-first");
    this.closeButton = this.element.find(".expand-toggle__content-last");

    // Interactions
    this.openButton.on("click", (() => {
      this.contentContainer.addClass("expanded");
      this.openButton.addClass("expanded");
    }).bind(this));
    this.closeButton.on("click", (() => {
      this.contentContainer.removeClass("expanded");
      this.openButton.removeClass("expanded");
    }).bind(this));

    // Content
    this.contentContainer.html(html);
}

  render() {
    return this.element;
  }
}
