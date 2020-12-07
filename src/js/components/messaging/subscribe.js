import { API } from "../../api";

export const subscribe = ($customCheckbox, $checkbox) => {
  Notification.requestPermission()
    .then((response) => {
      const api = new API();

      if (response === "granted") {
        navigator.serviceWorker.ready
          .then((serviceWorkerRegistration) => {
            api.getVAPIDKey().done((key) => {
              const options = {
                userVisibleOnly: true,
                applicationServerKey: key.vapid_public_key,
              };

              serviceWorkerRegistration.pushManager
                .subscribe(options)
                .then((pushSubscription) => {
                  const subscription = pushSubscription.toJSON();

                  api
                    .createPushSubscription(
                      JSON.stringify({
                        subscription_object: subscription,
                      })
                    )
                    .then(() => {
                      localStorage.setItem("hasSubscription", true);
                      $customCheckbox.addClass("w--redirected-checked");
                      $checkbox.checked = true;
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                })
                .catch((error) => {
                  console.error(`Error from pushMananger: ${error.toString()}`);
                });
            });
          })
          .catch((error) => {
            console.error(`Error during serviceWorker ready state: ${error}`);
          });
      }
    })
    .catch((error) => {
      console.error(
        `Error while requesting notification permission: ${error.toString()}`
      );
    });
};
