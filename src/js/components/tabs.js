import {LinkBlock} from './link-block.js';

export class ServicesTab {
  gridFullWidthTemplate = $(".styles .grid--fullwidth");

  constructor(api, element, tabContentContainer) {
    this.api = api;
    console.assert(element.length === 1);
    this.element = element;
    this.tabContentContainer = tabContentContainer;
    this.element.find(".icon div").removeClass("fas fa-spinner").addClass("fas fa-hands-helping");
    this.element.find(".label").text("Services");
    this.grid = this.gridFullWidthTemplate.clone();
    console.assert(this.grid.length === 1);
    this.grid.empty();

  }

  show() {
    this.api.getServices().done(((response) => {
      this.grid.empty();
      response.items.forEach(((item) => {
        const url = `/services/${item.meta.slug}/`;
        const linkBlock = new LinkBlock({
          title: item.title,
          url: url,
          subjectIconClasses: item.icon_classes,
        }).render();
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
