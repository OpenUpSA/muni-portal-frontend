import { API } from "../../api";
import { FullWidthGrid } from "../grid";
import { PageTitle, SectionHeading } from "../headings";

import { NotificationsSettings } from "../notifications";
import { ProfileInfo } from "./profile";

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

        $container.append(new SectionHeading("Notification settings").render());
        $container.append(NotificationsSettings());
      })
      .fail((error) => {
        $container.append(
          `We encountered an error while retrieving your profile information. Please contact support. ${error.responseText}`
        );
        console.error(error);
      });

    this.$element = $container;
  }

  render() {
    return this.$element;
  }
}
