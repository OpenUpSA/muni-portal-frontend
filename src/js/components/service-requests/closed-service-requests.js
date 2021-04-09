import { SERVICE_REQUEST_STATUS } from "../constants";

import { getDateString } from "../../utils/date";

import { StatusLinkblock } from "../molecules/status-link-block";
export class ClosedServiceRequests {
  constructor(serviceRequests) {
    const $sectionHeading = $(".components .section-heading").clone();
    const $noItemsMessage = $(".components .basic-block:eq(0)").clone();

    this.$element = $(".components .grid--default").clone();

    $sectionHeading.find(".section-title").text("Closed service requests");

    this.$element.append([$sectionHeading]);

    if (!serviceRequests.length) {
      $noItemsMessage.find(".h3-block-title").text("No closed requests");
      this.$element.append($noItemsMessage);
      return;
    }

    for (const request of serviceRequests) {
      this.$element.append(
        new StatusLinkblock({
          href: `detail/?id=${request.id}`,
          title: request.type,
          subtitle: request.request_date
            ? getDateString(request.request_date, false)
            : "",
          status: SERVICE_REQUEST_STATUS[request.status],
          statusClass: "link-block__status--green",
        }).render()
      );
    }
  }

  render() {
    return this.$element;
  }
}
