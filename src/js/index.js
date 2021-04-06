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

import { setMenuState } from "./utils/menu";

import { ServiceRequestDetail } from "./components/service-requests/service-request-detail";
import { ServiceRequestsIndex } from "./components/service-requests/index";
import { SubmitServiceRequest } from "./components/service-requests/submit-service-request";

import { Login } from "./components/account/login";
import { ForgotPassword } from "./components/account/forgot-password";
import { ResetPassword } from "./components/account/reset-password";
import { UserRegistration } from "./components/account/user-registration";
import { UserSettings } from "./components/account/user-settings";
import { VerifyUserRegistration } from "./components/account/user-registration-verify";
import { ChangePassword } from "./components/account/change-password";
import {
  copyTextToClipboard,
  getEmailShareURL,
  getFacebookShareURL,
  getLinkedinShareURL,
  getTwitterShareURL,
  getWhatsappShareURL,
} from "./utils/share";

const ENVIRONMENT = `${process.env.ENVIRONMENT}`;
const NODE_ENV = `${process.env.NODE_ENV}`;
const GOOGLE_TAG_MANAGER_ID = `${process.env.GOOGLE_TAG_MANAGER_ID}`;
const CONTEXT = `${process.env.CONTEXT}`;
const SENTRY_DSN = `${process.env.SENTRY_DSN}`;
const SENTRY_PERF_SAMPLE_RATE = `${process.env.SENTRY_PERF_SAMPLE_RATE}`;

if (
  NODE_ENV === "production" ||
  ENVIRONMENT === "production" ||
  ENVIRONMENT === "staging" ||
  ENVIRONMENT === "sandbox"
) {
  // Call as early as possible to maximise chance of registering reinstallation code
  tryRegisterSW();
} else {
  window.console.warn(
    `Not trying to register Service Worker because 
    ENVIRONMENT = ${ENVIRONMENT} and NODE_ENV = ${NODE_ENV}`
  );
}

if (SENTRY_DSN !== "undefined" && SENTRY_DSN !== "") {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: SENTRY_PERF_SAMPLE_RATE,
    environment: ENVIRONMENT,
  });
} else {
  window.console.warn("Not initialising Sentry because SENTRY_DSN is not set");
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
      icon: ".components .icon--grid",
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

    // sets the menu state based on the users login state
    setMenuState();

    // find the menu item links
    const $shareCopyLink = $(".share__link.copy-link");
    const $shareEmail = $(".share__link.email")[0];
    const $shareLinkedin = $(".share__link.linkedin")[0];
    const $shareWhatsapp = $(".share__link.whatsapp")[0];
    const $shareFacebook = $(".share__link.facebook")[0];
    const $shareTwitter = $(".share__link.twitter")[0];

    // hook up the menu item links to their event handlers
    $shareCopyLink.click(copyTextToClipboard);

    $shareWhatsapp.setAttribute("href", getWhatsappShareURL());
    $shareWhatsapp.setAttribute("target", "_blank");

    $shareFacebook.setAttribute("href", getFacebookShareURL());
    $shareFacebook.setAttribute("target", "_blank");

    $shareTwitter.setAttribute("href", getTwitterShareURL());
    $shareTwitter.setAttribute("target", "_blank");

    $shareLinkedin.setAttribute("href", getLinkedinShareURL());
    $shareLinkedin.setAttribute("target", "_blank");

    $shareEmail.setAttribute("href", getEmailShareURL());
    $shareEmail.setAttribute("target", "_blank");

    // show the sharing button
    const $shareButton = $(".share");
    $shareButton.show();

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
        path: new RegExp("^/service-requests/$"),
        view: this.viewServiceRequestsIndex.bind(this),
        viewType: "Service Requests landing",
      },
      {
        path: new RegExp("^/service-requests/submit$"),
        view: this.submitServiceRequestsIndex.bind(this),
        viewType: "Submit a service request",
      },
      {
        path: new RegExp("^/service-requests/detail/.*$"),
        view: this.serviceRequestsDetail.bind(this),
        viewType: "Service request detail",
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
        path: new RegExp("^/accounts/forgot-password/$"),
        view: this.viewForgotPassword.bind(this),
        viewType: "User Management",
      },
      {
        path: new RegExp("^/accounts/reset-password/$"),
        view: this.viewResetPassword.bind(this),
        viewType: "User Management",
      },
      {
        path: new RegExp("^/account/change-password/$"),
        view: this.viewChangePassword.bind(this),
        viewType: "User Management",
      },
      {
        path: new RegExp("^/accounts/settings/$"),
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
          const title = "Administration";
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

  viewServiceRequestsIndex() {
    this.modalPage.show();
    const serviceRequestsIndex = new ServiceRequestsIndex();
    const title = "My service requests";
    this.setTitle(title);
    this.modalPage.setContent(serviceRequestsIndex.render(), title);
  }

  submitServiceRequestsIndex() {
    this.modalPage.show();
    const submitServiceRequests = new SubmitServiceRequest();
    const title = "Submit a service request";
    this.setTitle(title);
    this.modalPage.setContent(submitServiceRequests.render(), title);
  }

  serviceRequestsDetail() {
    this.modalPage.show();
    const serviceRequestsDetail = new ServiceRequestDetail();
    const title = "Service request details";
    this.setTitle(title);
    this.modalPage.setContent(serviceRequestsDetail.render(), title);
  }

  viewLogin() {
    this.modalPage.show();
    const login = new Login();
    const title = "Login to MyMuni";
    this.setTitle(title);
    this.modalPage.setContent(login.render(), title);
  }

  viewUserRegistration() {
    this.modalPage.show();
    const userRegistration = new UserRegistration();
    const title = "Create an account in MyMuni";
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

  viewResetPassword() {
    this.modalPage.show();
    const resetPassword = new ResetPassword();
    const title = "Reset Password";
    this.setTitle(title);
    this.modalPage.setContent(resetPassword.render(), title);
  }

  viewChangePassword() {
    this.modalPage.show();
    const changePassword = new ChangePassword();
    const title = "Change Password";
    this.setTitle(title);
    this.modalPage.setContent(changePassword.render(), title);
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

if (CONTEXT === "production" && GOOGLE_TAG_MANAGER_ID !== "undefined") {
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
} else {
  window.console.warn("Not initialising Google Tag Manager");
}

const app = new App();

window.testSentry = () => nonExistentFunction();
