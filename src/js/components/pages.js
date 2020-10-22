import { LinkBlock, ShadedIconLinkBlock } from "./link-block.js";
import { FullWidthGrid } from "./grid.js";

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

export class AdministrationIndex {
  constructor(content) {
    this.name = content.title;
    this.overview = content.overview;
    console.log(content.ancestor_pages);
    // drop the first two entries from the array
    const breadcrumbs = content.ancestor_pages.slice(2);
    // add a label property to the crumb
    const breadcrumbsWithLabel = breadcrumbs.map((crumb) => {
      crumb.label = crumb.title;
      return crumb;
    });
    this.breadcrumbItems = breadcrumbsWithLabel;
    this.childPages = content.child_pages;
  }

  render() {
    const childPageLinks = this.childPages.map((page) => {
      return new LinkBlock({
        title: page.title,
        subtitle: "",
        url: page.url,
        subjectIconClasses: page.icon_classes,
      });
    });

    const children = [
      new PageTitle(this.name).render(),
      new Breadcrumbs(this.breadcrumbItems).render(),
      new SectionHeading("Administrators").render(),
      new FullWidthGrid(childPageLinks).render(),
    ];

    return children;
  }
}

export class Service {
  constructor(service) {
    this.name = service.title;
    this.overview = service.overview;
    this.breadcrumbItems = [{ label: "Services", url: "/services/" }];
    this.contacts = service.service_contacts.map(
      (details) => new Contact(details)
    );
  }

  render() {
    const children = [
      new PageTitle(this.name).render(),
      new Breadcrumbs(this.breadcrumbItems).render(),
      new SectionHeading("Overview").render(),
      new ExpandableRichText(this.overview).render(),
    ];

    if (this.contacts.length > 0) {
      children.push(
        new SectionHeading("Contacts").render(),
        new FullWidthGrid(this.contacts).render()
      );
    }
    return children;
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
    this.openButton.on(
      "click",
      (() => {
        this.contentContainer.addClass("expanded");
        this.openButton.addClass("expanded");
      }).bind(this)
    );
    this.closeButton.on(
      "click",
      (() => {
        this.contentContainer.removeClass("expanded");
        this.openButton.removeClass("expanded");
      }).bind(this)
    );

    // Content
    this.contentContainer.html(html);
  }

  render() {
    return this.element;
  }
}

class Contact extends LinkBlock {
  constructor(contact) {
    super({
      title: contact.type.label,
      subtitle: contact.value,
      url: Contact.getLink(contact),
      targetIconClasses: contact.type.icon_classes,
      shadedTarget: true,
    });
  }

  static getLink(contact) {
    switch (contact.type.slug) {
      case "phone":
        return `tel:${contact.value}`;
      case "email":
        return `mailto:${contact.value}`;
      case "physical_address":
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          contact.value
        )}`;
      default:
        return "#";
    }
  }
}
