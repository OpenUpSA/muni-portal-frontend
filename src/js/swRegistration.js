import {Workbox, messageSW} from 'workbox-window';

export function tryRegisterSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.debug("registering service worker");
      const wb = new Workbox('/service-worker.js');
      let registration;
      const showSkipWaitingPrompt = (event) => {
        console.debug("showskip", event);
        if (confirm("An update is available. Would you like to update the app now?")) {
          wb.addEventListener('controlling', (event) => {
            window.location.reload();
          });

          console.debug("skip waiting", registration);

          if (registration && registration.waiting) {
            messageSW(registration.waiting, {type: 'SKIP_WAITING'});
          } else {
            console.debug("How'd we get here?!");
          }
        } else {
          console.debug("Update rejected. Continue as is.");
        }
      };

      // Add an event listener to detect when the registered
      // service worker has installed but is waiting to activate.
      wb.addEventListener('waiting', showSkipWaitingPrompt);
      wb.addEventListener('externalwaiting', showSkipWaitingPrompt);

      wb.register().then((r) => {
        console.debug("then assign", r);
        registration = r;
      });
    });
  } else {
    console.debug("serviceWorker not supported");
  };
}
