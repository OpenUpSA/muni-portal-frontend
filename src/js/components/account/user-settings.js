import { BasicBlock } from "../basic-block";
import { FullWidthGrid } from "../grid";
import { getCustomCheckbox } from "../../utils/element-factory";

import { PageTitle, SectionHeading } from "../headings";

export class UserSettings {
  constructor() {
    const $container = $("<div />");
    const accountSettingsSections = [];
    const $emailNotifications = getCustomCheckbox({
      identifier: "notify-email",
      name: "notify-email",
      text: "Receive email notifications",
    });
    const $inAppNotifications = getCustomCheckbox({
      identifier: "notify-inapp",
      name: "notify-inapp",
      text: "Receive in-app notifications",
    });
    const $inAppNotificationsNoSupportMsg = new BasicBlock({
      title: "In-app notifications is not supported on your device 😞",
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

    if (!("Notification" in window)) {
      $container.append($inAppNotificationsNoSupportMsg.render());
    } else {
      $container.append($inAppNotifications);
      $inAppNotifications.click(() => {
        this.setInAppNotificationState();
      });
    }

    $container.append($emailNotifications);

    this.$element = $container;
  }

  setInAppNotificationState() {
    Notification.requestPermission().then((response) => {
      if (response !== "granted") {
        alert("FUCK YOU!!!!!!!!!!");
      }
    });
  }

  render() {
    return this.$element;
  }
}
