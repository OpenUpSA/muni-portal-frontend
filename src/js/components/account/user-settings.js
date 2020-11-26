import { BasicBlock } from "../basic-block";
import { FullWidthGrid } from "../grid";
import { getCustomCheckbox } from "../../utils/element-factory";

import { PageTitle, SectionHeading } from "../headings";

export class UserSettings {
  constructor() {
    const $container = $("<div />");
    const accountSettingsSections = [];
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

    accountSettingsSections.push(
      new BasicBlock({
        title: "Username",
        subtitle: "Mr. Bones",
      })
    );
    accountSettingsSections.push(
      new BasicBlock({
        title: "Email address",
        subtitle: "mister@bones.io",
      })
    );

    $container.append(new PageTitle("Account Settings").render());
    $container.append(new SectionHeading("Profile information").render());
    $container.append(new FullWidthGrid(accountSettingsSections).render());

    $container.append(new SectionHeading("Notification settings").render());

    // is Notifications supported?
    if (!("Notification" in window)) {
      $container.append($inAppNotificationsNoSupportMsg.render());
    } else {
      // check the current Notification.permission status
      // and update the state of the checkbox if permission
      // was already granted
      if (Notification.permission === "granted") {
        this.$inAppNotificationsCutomCheckbox.addClass("w--redirected-checked");
        this.$inAppNotificationsCheckbox.checked = true;
      }

      $container.append($inAppNotificationsContainer);

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
    }

    this.$element = $container;
  }

  setInAppNotificationState() {
    Notification.requestPermission()
      .then((response) => {
        if (response === "granted") {
          this.$inAppNotificationsCutomCheckbox.addClass(
            "w--redirected-checked"
          );
          this.$inAppNotificationsCheckbox.checked = true;
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
