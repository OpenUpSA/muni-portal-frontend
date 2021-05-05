import { API } from "../../api";
import { SERVICE_REQUEST_STATUS } from "../constants";

import { getDateString } from "../../utils/date";

import { BasicBlock } from "../basic-block";
import { BlockPreWrap } from "../atoms/block-pre-wrap";
import { FullWidthGrid } from "../grid";
import { LoadingPlaceholder } from "../atoms/loading-placeholder";
import { StatusMessage } from "../molecules/status-message";

export class ServiceRequestDetail {
  constructor() {
    const api = new API();
    const url = new URL(document.location.href);
    const $loadingPlaceholder = new LoadingPlaceholder(
      "Loading service request details..."
    );
    const serviceRequestId = new URLSearchParams(url.search).get("id");
    const $sectionHeading = $(".components .section-heading");

    this.$element = new FullWidthGrid([$loadingPlaceholder]).render();

    api
      .getServiceRequest(serviceRequestId)
      .then((response) => {
        $loadingPlaceholder.remove();

        const $serviceRequestInfoHeading = $sectionHeading.clone();
        const $serviceDescriptionHeading = $sectionHeading.clone();

        $serviceRequestInfoHeading
          .find(".section-title")
          .text("Service request information");

        $serviceDescriptionHeading
          .find(".section-title")
          .text("Service request description");

        this.$element.append($serviceRequestInfoHeading);

        this.$element.append(
          new BasicBlock({
            title: "Date submitted",
            subtitle: response.request_date
              ? getDateString(response.request_date, false)
              : "No date provided",
          }).render()
        );

        this.$element.append(
          new BasicBlock({
            title: "Reference number",
            subtitle: response.on_premis_reference || "No reference number yet",
          }).render()
        );

        this.$element.append(
          new BasicBlock({
            title: "Current status",
            subtitle: SERVICE_REQUEST_STATUS[response.status],
          }).render()
        );

        this.$element.append(
          new BasicBlock({
            title: "Service area",
            subtitle: response.type || "No service type specified",
          }).render()
        );

        if (response.street_name || response.street_number || response.suburb) {
          this.$element.append(
            new BasicBlock({
              title: "Address",
              subtitle: `${response.street_name} ${response.street_number}, ${response.suburb}`,
            }).render()
          );
        }

        if (response.coordinates) {
          const staticMapEvent = new CustomEvent("add-static-map", {
            detail: response.coordinates,
          });
          this.$element.append(
            $("<div />", {
              id: "static-service-request-map",
              style: "height: 300px",
            })
          );
          document.dispatchEvent(staticMapEvent);
        }

        this.$element.append([
          $serviceDescriptionHeading,
          new BlockPreWrap(response.description).render(),
        ]);
      })
      .fail((a, b) => {
        this.$element.empty().append(
          new StatusMessage({
            text: "Error while loading service request details.",
            status: "failure",
          }).render()
        );
        console.error(a, b);
      });
  }

  render() {
    return this.$element;
  }
}
