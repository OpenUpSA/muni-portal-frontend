export class PageTitle {
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

export class SectionHeading {
  template = $(".styles .section-heading").first();

  constructor(heading) {
    this.element = this.template.clone();
    this.element.find(".section-title").text(heading);
  }

  render() {
    return this.element;
  }
}
