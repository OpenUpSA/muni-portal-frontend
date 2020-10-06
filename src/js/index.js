import {tryRegisterSW} from './swRegistration.js';
import {ServicesTab, TabContentContainer} from './components/tabs.js';

// Call as early as possible to maximise chance of registering reinstallation code
tryRegisterSW();

const settings = {
  defaultBaseUrl: "https://muni-portal-backend.openup.org.za"
};


const tabContentContainer = new TabContentContainer($(".tab-content"));
const servicesTab = new ServicesTab(settings, $(".main .tab-link").first(), tabContentContainer);

servicesTab.show();
