import logo36x36 from '../icon/lighthouse-icon-36x36.png';
import exploreIcon from '../icon/explore-144x144.png';
import logo620x620 from '../icon/lighthouse-icon.png';


const serviceWorkerPath = '/service-worker.js';

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log("registering service worker");
    navigator.serviceWorker.register(serviceWorkerPath);
  });
} else {
  console.log("serviceWorker not supported");
};
