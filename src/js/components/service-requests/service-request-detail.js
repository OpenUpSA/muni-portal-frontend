import { API } from "../../api";
import { SERVICE_REQUEST_STATUS } from "../constants";

import { BasicBlock } from "../basic-block";
import { FullWidthGrid } from "../grid";
import { LoadingPlaceholder } from "../atoms/loading-placeholder";

export class ServiceRequestDetail {
  constructor() {
    const api = new API();
    const url = new URL(document.location.href);
    const $loadingPlaceholder = new LoadingPlaceholder();
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
            subtitle: response.request_date,
          }).render()
        );

        this.$element.append(
          new BasicBlock({
            title: "Reference number",
            subtitle: response.on_premis_reference,
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
            subtitle: response.type,
          }).render()
        );

        this.$element.append(
          new BasicBlock({
            title: "Address",
            subtitle: `${response.street_name} ${response.street_number}, ${response.suburb}`,
          }).render()
        );

        this.$element.append([
          $serviceDescriptionHeading,
          $("<p>", { text: response.description }),
        ]);
      })
      .fail((a, b) => console.error(a, b));
  }

  render() {
    return this.$element;
  }
}
