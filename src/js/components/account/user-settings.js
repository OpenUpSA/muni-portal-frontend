import { API } from "../../api";
import { BasicBlock } from "../basic-block";
import { FullWidthGrid } from "../grid";
import { getCustomCheckbox } from "../../utils/element-factory";

import { PageTitle, SectionHeading } from "../headings";

export class UserSettings {
  constructor() {
    const $container = $("<div />");

    this.api = new API();
    this.api
      .getUserProfile()
      .done((profile) => {
        $container.append(new PageTitle("Account Settings").render());
        $container.append(new SectionHeading("Profile information").render());

        $container.append(
          new FullWidthGrid(this.getProfileInfo(profile)).render()
        );

        $container.append(new SectionHeading("Notification settings").render());
        $container.append(this.getNotificationsSettings());
      })
      .fail((error) => {
        $container.append(
          `We encountered an error while retrieving your profile information. Please contact support. ${error.responseText}`
        );
        console.error(error);
      });

    this.$element = $container;
  }

  getNotificationsSettings() {
    const $inAppNotificationsContainer = getCustomCheckbox({
      identifier: "notify-inapp",
      name: "notify-inapp",
      text: "Receive in-app notifications",
    });
    this.$inAppNotificationsCutomCheckbox = $inAppNotificationsContainer.find(
      ".w-checkbox-input"
    );
    this.$inAppNotificationsCheckbox = $inAppNotificationsContainer.find(
      "input[type='checkbox']"
    );
    const $inAppNotificationsNoSupportMsg = new BasicBlock({
      title: "In-app notifications is not supported on your device",
      subtitle: "",
    });
    // is Notifications and ServiceWorker supported?
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      return $inAppNotificationsNoSupportMsg.render();
    } else {
      // set checkbox to checked if the user has a pushMessage subscription
      if (localStorage.getItem("hasSubscription") === "true") {
        this.$inAppNotificationsCutomCheckbox.addClass("w--redirected-checked");
        this.$inAppNotificationsCheckbox.checked = true;
      }

      // if the user has not denied permissions before
      if (Notification.permission !== "denied") {
        this.$inAppNotificationsCutomCheckbox.click(() => {
          // subscribe or unsubscribe user
          this.setInAppNotificationState();
        });
      }

      return $inAppNotificationsContainer;
    }
  }

  getProfileInfo(profile) {
    const accountSettingsSections = [];
    accountSettingsSections.push(
      new BasicBlock({
        title: "Username",
        subtitle: profile.username,
      })
    );
    accountSettingsSections.push(
      new BasicBlock({
        title: "Email address",
        subtitle: profile.email,
      })
    );
    return accountSettingsSections;
  }

  subscribeUser() {
    Notification.requestPermission()
      .then((response) => {
        if (response === "granted") {
          this.$inAppNotificationsCutomCheckbox.addClass(
            "w--redirected-checked"
          );

          navigator.serviceWorker.ready
            .then((serviceWorkerRegistration) => {
              this.api.getVAPIDKey().done((key) => {
                const options = {
                  userVisibleOnly: true,
                  applicationServerKey: key.vapid_public_key,
                };

                serviceWorkerRegistration.pushManager
                  .subscribe(options)
                  .then((pushSubscription) => {
                    const subscription = pushSubscription.toJSON();

                    this.api
                      .createPushSubscription(
                        JSON.stringify({
                          subscription_object: subscription,
                        })
                      )
                      .then(() => {
                        console.info("waiting for push notifications");
                        localStorage.setItem("hasSubscription", true);
                        this.$inAppNotificationsCheckbox.checked = true;
                      })
                      .catch((error) => {
                        console.error(error);
                      });
                  })
                  .catch((error) => {
                    console.error(
                      `Error from pushMananger: ${error.toString()}`
                    );
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
  }

  setInAppNotificationState() {
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
                    this.$inAppNotificationsCutomCheckbox.removeClass(
                      "w--redirected-checked"
                    );
                  }
                })
                .catch((error) => {
                  console.error(
                    `Error while unsubscribing from subscription: ${error.toString()}`
                  );
                });
            } else {
              this.subscribeUser();
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

  render() {
    return this.$element;
  }
}
