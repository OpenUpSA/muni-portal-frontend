import {LinkBlock} from './link-block.js';
import { FullWidthGrid } from './grid.js';

/**
 * Replacing the current icon in the tab with the new specified icon
 * @param {Object} element - The root DOM element containing the icon
 * @param {String} icon - new icon classes to add
 */
function setTabIcon(element, iconClasses) {
  element.find(".icon div").removeClass("fas fa-spinner").addClass(iconClasses);
}

export class MyMuniTab {
  constructor(api, element, tabContentContainer) {
    this.api = api;
    console.assert(element.length === 1);
    this.element = element;
    this.tabContentContainer = tabContentContainer;
  }

  show() {
    this.api.getMyMuni().done(((response) => {
      const tabTitle = "My Muni";
      const tabTitleElem = this.element.find(".label");
      const linkList = response.items.map(((item) => {
        const url = `/my-municipality/${item.meta.slug}`;
        return new LinkBlock({
          title: item.title,
          url,
          subjectIconClasses: "fas fa-user-friends"
        });
      }).bind(this));
      this.grid = new FullWidthGrid(linkList);
      tabTitleElem.text(tabTitle);
      setTabIcon(this.element, "fas fa-landmark");
      this.tabContentContainer.element.html(this.grid.render());
    }).bind(this))
      .fail(function(a, b) {
        console.error(a, b);
      });
  }
}
export class ServicesTab {

  constructor(api, element, tabContentContainer) {
    this.api = api;
    console.assert(element.length === 1);
    this.element = element;
    this.tabContentContainer = tabContentContainer;
  }

  show() {
    this.api.getServices().done(((response) => {
      const tabTitle = "Services";
      const tabTitleElem = this.element.find(".label");
      const serviceLinks = response.items.map(((item) => {
        const url = `/services/${item.meta.slug}/`;
        return new LinkBlock({
          title: item.title,
          url: url,
          subjectIconClasses: item.icon_classes,
        });
      }).bind(this));
      this.grid = new FullWidthGrid(serviceLinks);
      tabTitleElem.text(tabTitle);
      setTabIcon(this.element, "fas fa-hands-helping");
      this.tabContentContainer.element.html(this.grid.render());
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
