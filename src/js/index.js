import {tryRegisterSW} from './swRegistration.js';
import {MyMuniTab, ServicesTab, TabContentContainer} from './components/tabs.js';
import {ModalPage, Service} from './components/pages.js';
import {API} from './api.js';

// Call as early as possible to maximise chance of registering reinstallation code
tryRegisterSW();

/**
 * Creates and returns the HTML for a linked tab
 * @param {String} tabTemplate - The HTML of the cloned tab template
 * @param {*} href - The `href` for the anchor link
 * @returns The linked tab HTML as a string
 */
function createTab(tabTemplate, href) {
  const linkTab = document.createElement("a");
  linkTab.href = href;
  linkTab.classList.add("tab-link__wrap");

  linkTab.append(tabTemplate);
  
  return linkTab;
}

class App {
  constructor() {
    this.api = new API();

    const tabContentContainer = new TabContentContainer($(".tab-content"));
    
    const $mainContainer = $(".main");
    const $tabsContainer = $mainContainer.find(".tab-links__wrap");

    $tabsContainer.on('click', 'a', function (event) {
      const $tabs = $tabsContainer.find('.tab-link');
      // remove active class for all tabs
      $tabs.removeClass('active');
      // remove the `tab-link__bg` div from all tabs 
      $tabs.find('.tab-link__bg').remove();
      // set the active class on the clicked tab
      $(this).find(".tab-link").addClass("active");
    });

    const tabTemplate = $mainContainer.find(".tab-link");
    
    const myServicesAnchor = createTab(tabTemplate.clone()[0], "/services/");
    const myMuniAnchor = createTab(tabTemplate.clone()[0], "/my-municipality/");
    
    ($tabsContainer).append($(myServicesAnchor));
    ($tabsContainer).append($(myMuniAnchor));
    
    this.servicesTab = new ServicesTab(this.api, $(myServicesAnchor), tabContentContainer);
    this.myMuniTabContent = new MyMuniTab(this.api, $(myMuniAnchor), tabContentContainer);

    // HACK TO HIDE DEFAULT ADDED FIRST TAB
    $mainContainer.find(".tab-link__wrap").first().remove();

    this.modalPage = new ModalPage($(".main .page__wrap"));

    this.router = new Router([
      { path: /^\/?$/, view: () => this.viewRedirect("/services/") },
      { path: new RegExp('^/services/$'), view: this.viewServices.bind(this) },
      { path: /^\/services\/(?<serviceSlug>[\w-]+)\/$/, view: this.viewService.bind(this) },
      { path: new RegExp('^/my-municipality/$'), view: this.viewMyMuni.bind(this) },
      { path: new RegExp('.*'), view: function() { $('body').text('Not found!'); }},
    ]);
    this.router.route();
  }

  setTitle(title) {
    $("title").text(title);
  }

  viewRedirect(location) {
    window.history.pushState({}, "", location);
    this.router.route();
  }

  viewMyMuni() {
    this.modalPage.hide();
    this.myMuniTabContent.show();
    this.setTitle("My Muni");
  }

  viewServices() {
    this.modalPage.hide();
    this.servicesTab.show();
    this.setTitle("Services");
  }

  viewService(params){
    this.modalPage.show();

    this.api.getService(params.serviceSlug).done(((response) => {
        console.assert(response.meta.total_count == 1);
        const service = new Service(response.items[0]);
        this.setTitle(response.items[0].title);
        this.modalPage.setContent(service.render());
      }).bind(this))
      .fail(function(a, b) {
        console.error(a, b);
      });
  }
}

class Router {
  constructor(routes) {
    this.routes = routes;
    const router = this;
    $("body").on('click', 'a[href^="/"]', function(e) {
      e.preventDefault();
      window.history.pushState({}, "", $(this).attr("href"));
      router.route();
    });

    window.addEventListener("popstate", this.route.bind(this));
  }

  parseLocation() { return window.location.pathname; }

  route(e) {
    const location = this.parseLocation();
    for (const route of this.routes) {
      const match = route.path.exec(location);
      if (match) {
        console.debug(location, "matched", route);
        route.view(match.groups);
        return;
      }
    }

    console.error("No match for ", location);
  }
}
const app = new App();
