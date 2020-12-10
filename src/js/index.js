import { tryRegisterSW } from "./swRegistration.js";

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import {
  MyMuniTab,
  ServicesTab,
  TabContentContainer,
} from "./components/tabs.js";

import { TabItem } from "./components/tab-item.js";

import {
  AdministrationIndex,
  ModalPage,
  Service,
  Administrator,
  ErrorPage,
} from "./components/pages.js";
import * as pages from "./components/pages.js";
import { API } from "./api.js";

import { setMenuState, updateMenuLinks } from "./utils/menu";

import { Login } from "./components/account/login";
import { ForgotPassword } from "./components/account/forgot-password";
import { UserRegistration } from "./components/account/user-registration";
import { UserSettings } from "./components/account/user-settings";
import { VerifyUserRegistration } from "./components/account/user-registration-verify";

// Call as early as possible to maximise chance of registering reinstallation code
tryRegisterSW();

const CONTEXT = `${process.env.CONTEXT}`;
const SENTRY_DSN = `${process.env.SENTRY_DSN}`;
const SENTRY_PERF_SAMPLE_RATE = `${process.env.SENTRY_PERF_SAMPLE_RATE}`;

if (CONTEXT === "production" && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: SENTRY_PERF_SAMPLE_RATE,
  });
}

class App {
  constructor() {
    this.api = new API();

    const tabContentContainer = new TabContentContainer($(".tab-content"));

    const $mainContainer = $(".main");
    this.$tabsContainer = $mainContainer.find(".tab-links__wrap");
    // first remove any existing elements and text from the container
    this.$tabsContainer.empty();

    this.$servicesTab = new TabItem({
      title: "Services",
      url: "/services/",
      icon: ".styles .icon--grid",
    }).render();

    this.$myMuniTab = new TabItem({
      title: "My Muni",
      url: "/my-municipality/",
      icon: "fas fa-landmark",
    }).render();

    this.$tabsContainer.append(this.$servicesTab);
    this.$tabsContainer.append(this.$myMuniTab);

    this.servicesTab = new ServicesTab(
      this.api,
      this.$servicesTab,
      tabContentContainer
    );

    this.myMuniTabContent = new MyMuniTab(
      this.api,
      this.$myMuniTab,
      tabContentContainer
    );

    // HACK TO HIDE DEFAULT ADDED FIRST TAB
    $mainContainer.find(".tab-link__wrap").first().remove();

    updateMenuLinks();
    // sets the menu state based on the users login state
    setMenuState();

    this.modalPage = new ModalPage($(".main .page__wrap"));

    this.router = new Router([
      { path: /^\/?$/, view: () => this.viewRedirect("/services/") },
      {
        path: new RegExp("^/services/$"),
        view: this.viewServices.bind(this),
        viewType: "Service landing",
      },
      {
        path: /^\/services\/(?<serviceSlug>[\w-]+)\/$/,
        view: this.viewService.bind(this),
        viewType: "Service",
      },
      {
        path: new RegExp("^/my-municipality/$"),
        view: this.viewMyMuni.bind(this),
        viewType: "MyMuni landing",
      },
      {
        path: new RegExp("^/my-municipality/administration/$"),
        view: this.viewAdministrationIndex.bind(this),
        viewType: "Administration landing",
      },
      {
        path: new RegExp("^/accounts/login/$"),
        view: this.viewLogin.bind(this),
        viewType: "Authentication",
      },
      {
        path: new RegExp("^/accounts/register/$"),
        view: this.viewUserRegistration.bind(this),
        viewType: "User Registration",
      },
      {
        path: new RegExp("^/accounts/verify-registration/$"),
        view: this.viewVerifyUserRegistration.bind(this),
        viewType: "User Registration",
      },
      {
        path: new RegExp("^/accounts/reset-password/$"),
        view: this.viewForgotPassword.bind(this),
        viewType: "User Management",
      },
      {
        path: new RegExp("^/account/settings/$"),
        view: this.viewAccountSettings.bind(this),
        viewType: "User Settings",
      },
      {
        path: new RegExp(".*"),
        view: this.viewPage.bind(this),
        viewType: "Page",
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
    TabItem.setActiveTab(this.$tabsContainer, this.$myMuniTab);
    this.modalPage.hide();
    this.myMuniTabContent.show();
    this.setTitle("My Muni");
  }

  viewServices() {
    TabItem.setActiveTab(this.$tabsContainer, this.$servicesTab);
    this.modalPage.hide();
    this.servicesTab.show();
    this.setTitle("Services");
  }

  viewService(params) {
    this.modalPage.show();

    this.api
      .getService(params.serviceSlug)
      .done(
        ((response) => {
          console.assert(response.meta.total_count == 1);
          const service = new Service(response.items[0]);
          const title = response.items[0].title;
          this.setTitle(title);
          this.modalPage.setContent(service.render(), title);
        }).bind(this)
      )
      .fail(function (a, b) {
        console.error(a, b);
      });
  }

  viewPage(params, path) {
    this.modalPage.show();

    this.api
      .getPageByPath(path)
      .done(
        ((response) => {
          if (response.meta.type.startsWith("core.")) {
            const type = response.meta.type.slice(5);
            if (type in pages) {
              const pageClass = pages[type];
              const page = new pageClass(response);
              const title = response.title;
              this.setTitle(title);
              this.modalPage.setContent(page.render(), title);
            } else {
              this.modalPage.setContent(
                new ErrorPage(
                  `Page type ${type} not supported. Did you define the page type in components/page.js?`
                ).render()
              );
            }
          } else {
            this.modalPage.setContent(
              new ErrorPage(
                `Could not determine page type for meta type ${response.meta.type}`
              ).render()
            );
          }
        }).bind(this)
      )
      .fail(function (a, b) {
        console.error(a, b);
      });
  }

  viewAdministrationIndex() {
    this.modalPage.show();

    this.api
      .getAdministrationIndex()
      .done(
        ((response) => {
          console.assert(response.meta.total_count == 1);
          const content = response.items[0];
          const administrationIndex = new AdministrationIndex(content);
          const title = response.title;
          this.setTitle(title);
          this.modalPage.setContent(administrationIndex.render(), title);
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
          const title = response.items[0].title;
          this.setTitle(title);
          this.modalPage.setContent(administrator.render(), title);
        }).bind(this)
      )
      .fail(function (a, b) {
        console.error(a, b);
      });
  }

  viewLogin() {
    this.modalPage.show();
    const login = new Login();
    const title = "Sign in to MyMuni";
    this.setTitle(title);
    this.modalPage.setContent(login.render(), title);
  }

  viewUserRegistration() {
    this.modalPage.show();
    const userRegistration = new UserRegistration();
    const title = "Register for MyMuni";
    this.setTitle(title);
    this.modalPage.setContent(userRegistration.render(), title);
  }

  viewForgotPassword() {
    this.modalPage.show();
    const forgotPassword = new ForgotPassword();
    const title = "Forgot Password";
    this.setTitle(title);
    this.modalPage.setContent(forgotPassword.render(), title);
  }

  viewVerifyUserRegistration() {
    this.modalPage.show();
    const verifyUserRegsistration = new VerifyUserRegistration();
    const title = "Verify User Registration";
    this.setTitle(title);
    this.modalPage.setContent(verifyUserRegsistration.render(), title);
  }

  viewAccountSettings() {
    this.modalPage.show();
    const userSettings = new UserSettings();
    const title = "User settings";
    this.setTitle(title);
    this.modalPage.setContent(userSettings.render(), title);
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

  route(e) {
    let path = "";

    for (const route of this.routes) {
      path = window.location.pathname;
      const match = route.path.exec(path);
      if (match) {
        console.debug(path, "matched", route);
        dataLayer.push({
          event: "navigate",
          pagePath: path,
          pageType: route.viewType,
        });
        route.view(match.groups, path);
        return;
      }
    }

    console.error("No match for ", path);
  }
}

// Template literal for parcel to replace on build
const GOOGLE_TAG_MANAGER_ID = `${process.env.GOOGLE_TAG_MANAGER_ID}`;

if (`${process.env.CONTEXT}` === "production" && GOOGLE_TAG_MANAGER_ID) {
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", `${GOOGLE_TAG_MANAGER_ID}`);
}

const app = new App();

window.testSentry = () => nonExistentFunction();
