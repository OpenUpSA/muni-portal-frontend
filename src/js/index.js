import {tryRegisterSW} from './swRegistration.js';
import {ServicesTab, TabContentContainer} from './components/tabs.js';
import page from 'page';

// Call as early as possible to maximise chance of registering reinstallation code
tryRegisterSW();

const settings = {
  defaultBaseUrl: "https://muni-portal-backend.openup.org.za"
};

class App {
  constructor() {
    const tabContentContainer = new TabContentContainer($(".tab-content"));
    this.servicesTab = new ServicesTab(settings, $(".main .tab-link").first(), tabContentContainer);

    page('/', '/services');
    page('/services', this.viewServices.bind(this));
    page('/services/:service', this.viewService.bind(this));
    page('*', function(){
      $('body').text('Not found!')
    });
    page({
      hashbang: true
    });


  }



  viewServices() {

    this.servicesTab.show();
  }

  viewService(context){
    console.log("service", context.params.service);
  }

}

const app = new App();
