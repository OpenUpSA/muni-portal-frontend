import { API } from "../../api";

import { StatusLinkblock } from "../molecules/status-link-block";

export class CurrentServiceRequests {
  constructor() {
    const api = new API();
    const $sectionHeading = $(".components .section-heading").clone();
    const $noItemsMessage = $(".components .basic-block:eq(0)").clone();

    api
      .getServiceRequests()
      .then((serviceRequests) => {
        if (!serviceRequests.length) {
          this.$element.append(
            $noItemsMessage.find(".h3-block-title").text("No current requests")
          );
          return;
        }

        for (const request of serviceRequests) {
          this.$element.append(
            new StatusLinkblock({
              title: request.description,
              subtitle: request.request_date,
              status: request.status,
            }).render()
          );
        }
      })
      .fail((a, b) => console.error(a, b));

    this.$element = $(".components .grid--default").clone();

    $sectionHeading.find(".section-title").text("Current service requests");

    this.$element.append([$sectionHeading]);
  }

  render() {
    return this.$element;
  }
}
