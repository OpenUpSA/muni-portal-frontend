export class ServicesTab {
  gridFullWidthTemplate = $(".styles .grid--fullwidth");

  constructor(settings, element, tabContentContainer) {
    console.assert(element.length === 1);
    self.settings = settings;
    this.element = element;
    this.tabContentContainer = tabContentContainer;
    this.element.find(".icon div").removeClass("fas fa-spinner").addClass("fas fa-hands-helping");
    this.element.find(".label").text("Services");
    this.grid = this.gridFullWidthTemplate.clone();
    console.assert(this.grid.length === 1);
    this.grid.empty();

  }

  show() {
    const servicePagesUrl = `${self.settings.defaultBaseUrl}/api/wagtail/v2/pages/?type=core.ServicePage&fields=overview,icon_classes`;
    $.get(servicePagesUrl)
      .done(((response) => {
        this.grid.empty();
        response.items.forEach(((item) => {
          const url = `/services/${item.meta.slug}/`;
          const linkBlock = new IconLinkBlock(item.title, item.icon_classes, url).render();
          this.grid.append(linkBlock);
        }).bind(this));
        this.tabContentContainer.element.html(this.grid);
      }).bind(this))
      .fail(function(a, b) {
        console.error(a, b);
      });
  }
}

export class TabContentContainer {
  constructor(element) {
    console.assert(element.length === 1);
    this.element = element;
  }
}


const actionCardTemplate = $(".styles .card.action").clone();

class ActionCard {
  constructor(title, iconClasses, url) {
    this.element = $("<a></a>");
    this.element.attr("href", url);
    this.element.append(actionCardTemplate.clone());
    console.assert(this.element.length === 1);
    this.element.find(".label").text(title);
    this.element.find(".icon div").removeClass("fas fa-spinner").addClass(iconClasses);
  }
}

class IconLinkBlock {
  template = $(".styles .link-block:eq(3)");

  constructor(title, iconClasses, url) {
    this.element = this.template.clone();
    this.iconContainer = this.element.find(".link-block__icon div");
    this.labelContainer = this.element.find(".h3-block-title");

    this.element.attr("href", url);
    this.labelContainer.text(title);
    this.iconContainer.attr("class", "");
    this.iconContainer.addClass(iconClasses);
  }

  render() {
    return this.element;
  }
}
