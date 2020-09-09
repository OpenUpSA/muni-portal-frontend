import {Workbox, messageSW} from 'workbox-window';

const serviceWorkerPath = '/service-worker.js';

function makeSkipWaitingPrompt(wb, registration) {
  return (event) => {
    if (confirm("An update is available. Would you like to update the app now?")) {
      wb.addEventListener('controlling', (event) => {
        window.location.reload();
      });

      console.log(registration);
      if (registration && registration.waiting) {
        messageSW(registration.waiting, {type: 'SKIP_WAITING'});
      } else {
        console.log("How'd we get here?!");
      }
    } else {
      console.log("Update rejected. Continue as is.");
    }
  };
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log("registering service worker");
    const wb = new Workbox('/service-worker.js');
    let registration;
    const showSkipWaitingPrompt = makeSkipWaitingPrompt(wb, registration);

    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener('waiting', showSkipWaitingPrompt);
    wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

    wb.register().then((r) => registration = r);
  });
} else {
  console.log("serviceWorker not supported");
};
