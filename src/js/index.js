import { tryRegisterSW } from "./swRegistration.js";
import {
  MyMuniTab,
  ServicesTab,
  TabContentContainer,
} from "./components/tabs.js";
import {
  AdministrationIndex,
  ModalPage,
  Service,
  Administrator,
  ErrorPage,
} from "./components/pages.js";
import { API } from "./api.js";

// Call as early as possible to maximise chance of registering reinstallation code
tryRegisterSW();

/**
 * Creates and returns the HTML for a linked tab
 * @param {String} tabTemplate - The jQuery element of the cloned tab template
 * @param {*} href - The `href` for the anchor link
 * @returns The linked tab as jQuery element
 */
function createTabLinkAnchor(tabTemplate, href) {
  const draft = tabTemplate.clone();
  const anchor = $(document.createElement("a"));
  anchor.attr("href", href);
  anchor.attr("class", draft.attr("class"));
  anchor.css("text-decoration", "none");
  anchor.append(draft.contents());

  return anchor;
}

class App {
  constructor() {
    this.api = new API();

    const tabContentContainer = new TabContentContainer($(".tab-content"));

    const $mainContainer = $(".main");
    const $tabsContainer = $mainContainer.find(".tab-links__wrap");

    this.setActiveTab = ($activeTabAnchor) => {
      // Remove active from all
      const $tabs = $tabsContainer.find(".tab-link");
      $tabs.removeClass("active");
      $tabs.find(".tab-link__bg").removeClass("active");
      $tabs.find(".tab-link__base").removeClass("active");

      // Add active to specified
      $activeTabAnchor.addClass("active");
      //$activeTabAnchor.find(".tab-link__bg").addClass("active");
      $activeTabAnchor.find(".tab-link__base").addClass("active");
    };

    const tabTemplate = $(".styles .tab-link").first();

    this.$servicesAnchor = createTabLinkAnchor(tabTemplate, "/services/");
    this.$myMuniAnchor = createTabLinkAnchor(tabTemplate, "/my-municipality/");

    $tabsContainer.append(this.$servicesAnchor);
    $tabsContainer.append(this.$myMuniAnchor);

    this.servicesTab = new ServicesTab(
      this.api,
      this.$servicesAnchor,
      tabContentContainer
    );

    this.myMuniTabContent = new MyMuniTab(
      this.api,
      this.$myMuniAnchor,
      tabContentContainer
    );

    // HACK TO HIDE DEFAULT ADDED FIRST TAB
    $mainContainer.find(".tab-link__wrap").first().remove();

    this.modalPage = new ModalPage($(".main .page__wrap"));

    this.router = new Router([
      { path: /^\/?$/, view: () => this.viewRedirect("/services/") },
      { path: new RegExp("^/services/$"), view: this.viewServices.bind(this) },
      {
        path: /^\/services\/(?<serviceSlug>[\w-]+)\/$/,
        view: this.viewService.bind(this),
      },
      {
        path: new RegExp("^/my-municipality/$"),
        view: this.viewMyMuni.bind(this),
      },
      {
        path: new RegExp("^/my-municipality/administration/$"),
        view: this.viewAdministrationIndex.bind(this),
      },
      {
        path: /^\/my-municipality\/administration\/(?<administratorSlug>[\w-]+)\/$/,
        view: this.viewAdministrator.bind(this),
      },
      {
        path: new RegExp(".*"),
        view: this.viewPageNotFound.bind(this),
      },
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
    this.setActiveTab(this.$myMuniAnchor);
    this.modalPage.hide();
    this.myMuniTabContent.show();
    this.setTitle("My Muni");
  }

  viewServices() {
    this.setActiveTab(this.$servicesAnchor);
    this.modalPage.hide();
    this.servicesTab.show();
    this.setTitle("Services");
  }

  viewAdministrationIndex() {
    this.modalPage.show();

    this.api
      .getAdministrationIndex()
      .done(
        ((response) => {
          const content = response.items[0];
          const administrationIndex = new AdministrationIndex(content);
          this.setTitle(content.title);
          this.modalPage.setContent(administrationIndex.render());
        }).bind(this)
      )
      .fail(function (a, b) {
        console.error(a, b);
      });
  }

  viewAdministrator(params) {
    this.modalPage.show();

    this.api
      .getAdministrator(params.administratorSlug)
      .done(
        ((response) => {
          console.assert(response.meta.total_count == 1);
          const administrator = new Administrator(response.items[0]);
          this.setTitle(response.items[0].title);
          this.modalPage.setContent(administrator.render());
        }).bind(this)
      )
      .fail(function (a, b) {
        console.error(a, b);
      });
  }


  viewService(params) {
    this.modalPage.show();

    this.api
      .getService(params.serviceSlug)
      .done(
        ((response) => {
          console.assert(response.meta.total_count == 1);
          const service = new Service(response.items[0]);
          this.setTitle(response.items[0].title);
          this.modalPage.setContent(service.render());
        }).bind(this)
      )
      .fail(function (a, b) {
        console.error(a, b);
      });
  }

  viewPageNotFound() {
    this.modalPage.show();

    this.setTitle("Page not found");
    this.modalPage.setContent(new ErrorPage("Page not found").render());
  }
}

class Router {
  constructor(routes) {
    this.routes = routes;
    const router = this;
    $("body").on("click", 'a[href^="/"]', function (e) {
      e.preventDefault();
      window.history.pushState({}, "", $(this).attr("href"));
      router.route();
    });

    window.addEventListener("popstate", this.route.bind(this));
  }

  parseLocation() {
    return window.location.pathname;
  }

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
