import { Workbox } from "workbox-window";
import { getStatusBanner } from "./utils/connection-status";

let wb;

export function tryRegisterSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      wb = new Workbox("/service-worker.js", { updateViaCache: "none" });

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

      console.debug("registering service worker");
      wb.addEventListener("waiting", showSkipWaitingPrompt);
      wb.register()
        .then((status) => {
          console.debug("service worker registration successful", status);
          wb.messageSW({
            type: "START_BACKGROUND_CACHE",
          }).then((response) => {
            console.debug(
              ">>>>>>>>>>>>>>>>> background cache started",
              response
            );
            $(".nav").after(getStatusBanner(response));
            let $statusBanner = $statusBanner || $(".offline-status-banner");
            $statusBanner.show();
          });
        })
        .catch((error) => {
          console.error("Error while registering service worker", error);
        });
    });
  } else {
    console.debug("serviceWorker not supported");
  }
}

export function sendServiceWorkerMessage(message) {
  wb.messageSW(message);
}
