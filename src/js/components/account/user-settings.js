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
      // check the current Notification.permission status
      // and update the state of the checkbox if permission
      // was already granted
      if (Notification.permission === "granted") {
        this.$inAppNotificationsCutomCheckbox.addClass("w--redirected-checked");
        this.$inAppNotificationsCheckbox.checked = true;
      }

      // if the user has neither denied not granted permissions before
      if (
        Notification.permission !== "granted" &&
        Notification.permission !== "denied"
      ) {
        $inAppNotificationsContainer.click(() => {
          // ask for permission to send notifications
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

  setInAppNotificationState() {
    Notification.requestPermission()
      .then((response) => {
        if (response === "granted") {
          this.$inAppNotificationsCutomCheckbox.addClass(
            "w--redirected-checked"
          );
          this.$inAppNotificationsCheckbox.checked = true;

          navigator.serviceWorker.ready
            .then((serviceWorkerRegistration) => {
              this.api.getVAPIDKey().done((key) => {
                console.log(key);
                const options = {
                  userVisibleOnly: true,
                  applicationServerKey: key,
                };

                serviceWorkerRegistration.pushManager
                  .subscribe(options)
                  .then((pushSubscription) => {
                    console.log(`Subscribed ${pushSubscription.toString()}`);
                  })
                  .catch((error) => {
                    console.error(`Error from pushMananger: ${error}`);
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

  render() {
    return this.$element;
  }
}
