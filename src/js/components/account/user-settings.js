import { API } from "../../api";
import { FullWidthGrid } from "../grid";
import { PageTitle, SectionHeading } from "../headings";

import { ProfileInfo } from "./profile";
import { Checkbox } from "../molecules/checkbox";
import { StatusMessage } from "../molecules/status-message";
import { getAnchorElement } from "../../utils/element-factory";

export class UserSettings {
  constructor() {
    const $container = $("<div />");

    this.api = new API();
    this.api
      .getUserProfile()
      .done((profile) => {
        $container.append(new PageTitle("Account Settings").render());
        $container.append(new SectionHeading("Profile information").render());

        $container.append(new FullWidthGrid(ProfileInfo(profile)).render());

        const $changePasswordAnchor = getAnchorElement(
          "/account/change-password/",
          "",
          "Change Password"
        );
        $container.append($changePasswordAnchor);

        if (pushpad) {
          pushpad("status", (isSubscribed) => {
            if (isSubscribed) {
              $container.append(...this.manageNotificationPreferences());
            }
          });
        }
      })
      .fail((error) => {
        $container.append(
          `We encountered an error while retrieving your profile information. Please contact support. ${error.responseText}`
        );
        console.error(error);
      });

    this.$element = $container;
  }

  manageNotificationPreferences() {
    const $sectionHeading = new SectionHeading(
      "Notification settings"
    ).render();
    const $notificationsToggle = new Checkbox({
      label: "Receive in-app notifications",
    }).render();

    // we only show this entire section if we already know the user
    // is not subscribed so, no need to test again
    $notificationsToggle.on("click", (event) => {
      event.preventDefault();
      pushpad("subscribe", (isSubscribed) => {
        if (isSubscribed) {
          $notificationsToggle
            .find(".w-checkbox-input")
            .toggleClass("w--redirected-checked");
        } else {
          const $failedNotification = new StatusMessage({
            text:
              "Failed to subscribe to in-app notifications. Please ensure that in-app notifications are allowed and try again.",
            status: "failure",
          }).render();

          // NOTE: @TODO: Update in Webflow
          const styles = {
            color: "#94001D",
            marginBottom: "12px",
          };
          $failedNotification.css(styles);

          $failedNotification.insertAfter($sectionHeading);
        }
      });
    });

    return [$sectionHeading, $notificationsToggle];
  }

  render() {
    return this.$element;
  }
}
