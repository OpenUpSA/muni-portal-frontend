import logo36x36 from '../icon/lighthouse-icon-36x36.png';
import exploreIcon from '../icon/explore-144x144.png';
import logo620x620 from '../icon/lighthouse-icon.png';


const serviceWorkerPath = '/service-worker.js';

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register(serviceWorkerPath);

  console.log("registering service worker");
} else {
  console.log("serviceWorker not supported");
};
