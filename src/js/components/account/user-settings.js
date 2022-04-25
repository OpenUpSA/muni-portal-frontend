import { API } from "../../api";
import { FullWidthGrid } from "../grid";
import { PageTitle, SectionHeading } from "../headings";

import { ProfileInfo } from "./profile";
import { Checkbox } from "../molecules/checkbox";
import { StatusMessage } from "../molecules/status-message";
import { getAnchorElement } from "../../utils/element-factory";
import { SUPPORT_EMAIL } from "../constants";

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
          this.userSubscribed = false;
          $container.append(...this.manageNotificationPreferences());
        }
      })
      .fail((error) => {
        $container.append(
          `We encountered an error while retrieving your profile information. Please try again or <a href='mailto:${SUPPORT_EMAIL}'>contact support</a> ${
            error.responseText ? error.responseText : ''
          }`
        );
        console.error(error);
      });

    this.$element = $container;
  }

  pushpadError($sectionHeading) {
    const $docsLink = getAnchorElement(
      "https://app.gitbook.com/@openup/s/cape-agulhas-app/user-guide/reset-notification-preferences",
      "",
      "How do I reset notification preferences?"
    );
    const $failedNotification = new StatusMessage({
      text:
        "Failed to update in-app notifications status. Please ensure that in-app notifications are allowed and try again.",
      status: "failure",
    }).render();

    // NOTE: @TODO: Update in Webflow
    const styles = {
      color: "#94001D",
      marginBottom: "12px",
    };
    $failedNotification.css(styles);

    $failedNotification.insertAfter($sectionHeading);
    // a user tried to subscribe and it failed, perhaps
    // they previously blocked notifications, provide
    // a link to the docs.
    $docsLink.insertAfter($failedNotification);
  }

  subscribeUser($notificationsToggle, $sectionHeading) {
    pushpad("subscribe", (isSubscribed) => {
      if (isSubscribed) {
        $notificationsToggle
          .find(".w-checkbox-input")
          .addClass("w--redirected-checked");
        this.userSubscribed = true;
      } else {
        this.pushpadError($sectionHeading);
      }
    });
  }

  unsubscribeUser($notificationsToggle) {
    pushpad("unsubscribe", () => {
      $notificationsToggle
        .find(".w-checkbox-input")
        .removeClass("w--redirected-checked");
      this.userSubscribed = false;
    });
  }

  updateSubscriptionStatus($notificationsToggle, $sectionHeading) {
    if (!this.userSubscribed) {
      this.subscribeUser($notificationsToggle, $sectionHeading);
    } else {
      this.unsubscribeUser($notificationsToggle);
    }
  }

  manageNotificationPreferences() {
    const $sectionHeading = new SectionHeading(
      "Notification settings"
    ).render();
    const $notificationsToggle = new Checkbox({
      label: "Receive in-app notifications",
    }).render();

    pushpad("status", (isSubscribed) => {
      // the default state for the variable and the UI is
      // false so, we only update the UI and variable
      // if the user is already subscribed
      if (isSubscribed) {
        $notificationsToggle
          .find(".w-checkbox-input")
          .addClass("w--redirected-checked");
        this.userSubscribed = true;
      }
    });

    $notificationsToggle.on("click", (event) => {
      event.preventDefault();
      this.updateSubscriptionStatus($notificationsToggle, $sectionHeading);
    });

    return [$sectionHeading, $notificationsToggle];
  }

  render() {
    return this.$element;
  }
}
