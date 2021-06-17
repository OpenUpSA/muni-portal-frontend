import { Workbox } from "workbox-window";

export function tryRegisterSW() {
  if ("serviceWorker" in navigator) {
    console.debug("service worker in navigator");
    window.addEventListener("load", () => {
      const wb = new Workbox("/service-worker.js", { updateViaCache: "none" });

      const showSkipWaitingPrompt = () => {
        if (
          confirm(
            "An update is available. Would you like to update the app now?"
          )
        ) {
          wb.addEventListener("controlling", () => {
            window.location.reload();
          });

          console.debug("skip waiting");
          wb.messageSkipWaiting();
        } else {
          console.debug("Update rejected. Continue as is.");
        }
      };

      // Add an event listener to detect when the registered
      // service worker has installed but is waiting to activate.
      wb.addEventListener("waiting", showSkipWaitingPrompt);
      wb.addEventListener("externalwaiting", showSkipWaitingPrompt);

      console.debug("registering service worker");
      wb.register();
    });
  } else {
    console.debug("serviceWorker not supported");
  }
}
