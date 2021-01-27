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
        // switch (error.status) {
        //   case 401:
        //     this.api
        //       .getNewAccessToken() // todo: create this api call
        //       .done((tokens) => {
        //         // Set new access token
        //         localStorage.setItem("user", tokens.access);
        //         // todo: retry original request (wip, not sure best method yet)
        //       })
        //       .fail(() => {
        //         // Refresh token was invalid, so log the user out and redirect them
        //         localStorage.removeItem("user");
        //         localStorage.removeItem("refresh");
        //         window.location.replace = "/accounts/login/";
        //       });
        //     break;
        //
        //   default:
            $container.append(
              `We encountered an error while retrieving your profile information. Please contact support. ${error.responseText}`
            );
            console.error(error);
        // }
      });

    this.$element = $container;
  }

  render() {
    return this.$element;
  }
}