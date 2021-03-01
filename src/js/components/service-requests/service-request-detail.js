import { API } from "../../api";

import { BasicBlock } from "../basic-block";
import { FullWidthGrid } from "../grid";

// {
//   "id": 1,
//   "collaborator_object_id": 556704,

//   "user_name": "Mr JD",
//   "user_surname": "Bothma",
//   "user_mobile_number": "0792816737",
//   "user_email_address": "jd@openup.org.za",
//   "municipal_account_number": null,

//   "suburb": "Daar",
//   "description": "This one has the date 2020-02-01 sent from the app",
//   "coordinates": "12.3, 45.6",

//   "collaborator_status": "assigned",
//   "status": "in_progress",
//   "demarcation_code": "WC033",
//   "user": 1
// }

export class ServiceRequestDetail {
  constructor() {
    const api = new API();
    const url = new URL(document.location.href);
    const serviceRequestId = new URLSearchParams(url.search).get("id");
    const $sectionHeading = $(".components .section-heading");

    this.$element = new FullWidthGrid([]).render();

    api
      .getServiceRequest(serviceRequestId)
      .then((response) => {
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
            subtitle: response.status,
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
