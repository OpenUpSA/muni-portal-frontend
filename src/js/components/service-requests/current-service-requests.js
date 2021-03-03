import { SERVICE_REQUEST_STATUS } from "../constants";

import { getLocaleDateString } from "../../utils/date";

import { StatusLinkblock } from "../molecules/status-link-block";

export class CurrentServiceRequests {
  constructor(serviceRequests) {
    const $sectionHeading = $(".components .section-heading").clone();
    const $noItemsMessage = $(".components .basic-block:eq(0)").clone();

    this.$element = $(".components .grid--default").clone();

    $sectionHeading.find(".section-title").text("Current service requests");
    this.$element.append([$sectionHeading]);

    if (!serviceRequests.length) {
      $noItemsMessage.find(".h3-block-title").text("No current requests");
      this.$element.append($noItemsMessage);
      return;
    }

    for (const request of serviceRequests) {
      this.$element.append(
        new StatusLinkblock({
          href: `detail/?id=${request.id}`,
          title: request.description,
          subtitle: request.request_date
            ? getLocaleDateString(request.request_date)
            : "",
          status: SERVICE_REQUEST_STATUS[request.status],
          statusClass:
            request.status === "in_progress"
              ? "link-block__status--yellow"
              : null,
        }).render()
      );
    }
  }

  render() {
    return this.$element;
  }
}
