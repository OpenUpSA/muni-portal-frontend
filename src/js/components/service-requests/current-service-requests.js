import { API } from "../../api";
import { SERVICE_REQUEST_STATUS } from "../constants";

import { LoadingPlaceholder } from "../atoms/loading-placeholder";
import { StatusLinkblock } from "../molecules/status-link-block";

export class CurrentServiceRequests {
  constructor() {
    const api = new API();
    const $loadingPlaceholder = new LoadingPlaceholder();
    const $sectionHeading = $(".components .section-heading").clone();
    const $noItemsMessage = $(".components .basic-block:eq(0)").clone();

    this.$element = $(".components .grid--default").clone();

    $sectionHeading.find(".section-title").text("Current service requests");
    this.$element.append([$sectionHeading, $loadingPlaceholder.render()]);

    api
      .getServiceRequests()
      .then((serviceRequests) => {
        $loadingPlaceholder.remove();

        if (!serviceRequests.length) {
          this.$element.append(
            $noItemsMessage.find(".h3-block-title").text("No current requests")
          );
          return;
        }

        for (const request of serviceRequests) {
          this.$element.append(
            new StatusLinkblock({
              href: `detail/?id=${request.id}`,
              title: request.description,
              subtitle: request.request_date,
              status: SERVICE_REQUEST_STATUS[request.status],
            }).render()
          );
        }
      })
      .fail((a, b) => console.error(a, b));
  }

  render() {
    return this.$element;
  }
}
