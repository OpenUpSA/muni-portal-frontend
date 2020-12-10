import { BasicBlock } from "../basic-block";
import { getCustomCheckbox } from "../../utils/element-factory";

import { subscribe } from "../messaging/subscribe";

function setInAppNotificationState($customCheckbox, $checkbox) {
  navigator.serviceWorker.ready
    .then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.pushManager
        .getSubscription()
        .then((subscription) => {
          // the user is subscribed so, unsubscribe
          if (subscription) {
            subscription
              .unsubscribe()
              .then((result) => {
                if (result) {
                  localStorage.setItem("hasSubscription", false);
                  $customCheckbox.removeClass("w--redirected-checked");
                  $checkbox.checked = false;
                }
              })
              .catch((error) => {
                console.error(
                  `Error while unsubscribing from subscription: ${error.toString()}`
                );
              });
          } else {
            subscribe($customCheckbox, $checkbox);
          }
        })
        .catch((error) => {
          console.error(
            `Error while getting subscription: ${error.toString()}`
          );
        });
    })
    .catch((error) => {
      console.error(`Error in serviceWorker ready: ${error.toString()}`);
    });
}

export const NotificationsSettings = () => {
  const $inAppNotificationsContainer = getCustomCheckbox({
    identifier: "notify-inapp",
    name: "notify-inapp",
    text: "Receive in-app notifications",
  });
  const $inAppNotificationsCutomCheckbox = $inAppNotificationsContainer.find(
    ".w-checkbox-input"
  );
  const $inAppNotificationsCheckbox = $inAppNotificationsContainer.find(
    "input[type='checkbox']"
  );
  const $inAppNotificationsNoSupportMsg = new BasicBlock({
    title: "In-app notifications are not supported on your device",
    subtitle: "",
  });
  // is Notifications and ServiceWorker supported?
  if (!("Notification" in window) && !("serviceWorker" in navigator)) {
    return $inAppNotificationsNoSupportMsg.render();
  } else {
    // set checkbox to checked if the user has a pushMessage subscription
    if (localStorage.getItem("hasSubscription") === "true") {
      $inAppNotificationsCutomCheckbox.addClass("w--redirected-checked");
      $inAppNotificationsCheckbox.checked = true;
    }

    // if the user has not denied permissions before
    if (Notification.permission !== "denied") {
      $inAppNotificationsCutomCheckbox.click(() => {
        // subscribe or unsubscribe user
        setInAppNotificationState(
          $inAppNotificationsCutomCheckbox,
          $inAppNotificationsCheckbox
        );
      });
    }

    return $inAppNotificationsContainer;
  }
};
