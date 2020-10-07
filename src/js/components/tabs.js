const gridThirdsTemplate = $(".styles .grid--thirds").clone();

export class ServicesTab {
  constructor(settings, element, tabContentContainer) {
    console.assert(element.length === 1);
    self.settings = settings;
    this.element = element;
    this.tabContentContainer = tabContentContainer;
    this.element.find(".icon div").removeClass("fas fa-spinner").addClass("fas fa-hands-helping");
    this.element.find(".label").text("Services");
    this.grid = gridThirdsTemplate.clone();
    this.grid.empty();
  }

  show() {
    const servicePagesUrl = `${self.settings.defaultBaseUrl}/api/wagtail/v2/pages/?type=core.ServicePage&fields=overview,icon_classes`;
    $.get(servicePagesUrl)
      .done(((response) => {
        response.items.forEach(((item) => {
          const url = `/#!/services/${item.meta.slug}`;
          this.grid.append(new ActionCard(item.title, item.icon_classes, url).element);
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
