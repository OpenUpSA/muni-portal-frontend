import {tryRegisterSW} from './swRegistration.js';
import {ServicesTab, TabContentContainer} from './components/tabs.js';

// Call as early as possible to maximise chance of registering reinstallation code
tryRegisterSW();

const settings = {
  defaultBaseUrl: "https://muni-portal-backend.openup.org.za"
};

class App {
  constructor() {
    const tabContentContainer = new TabContentContainer($(".tab-content"));
    this.servicesTab = new ServicesTab(settings, $(".main .tab-link").first(), tabContentContainer);
    this.router = new Router([
      { path: new RegExp('^/services/$'), view: this.viewServices.bind(this) },
      { path: /^\/services\/(?<service>[\w-]+)\/$/, view: this.viewService.bind(this) },
      { path: new RegExp('.*'), view: function() { $('body').text('Not found!'); }},
    ]);
  }

  viewServices() {

    this.servicesTab.show();
  }

  viewService(params){
    console.log("service", params.service);
  }

}

class Router {
  constructor(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', this.route.bind(this));
    window.addEventListener('load', this.route.bind(this));
  }

  parseLocation() { return window.location.hash.slice(1).toLowerCase() || '/'; }

  route() {
    const location = this.parseLocation();
    for (const route of this.routes) {
      const match = route.path.exec(location);
      console.log("trying", route);
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
