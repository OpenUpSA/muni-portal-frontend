import { SimpleLinkBlock } from "../molecules/simple-link-block";
import { StatusMessage } from "../molecules/status-message";

export class ServiceRequestSubmitted {
  constructor() {
    const $allServiceRequests = new SimpleLinkBlock({
      href: "/service-requests/",
      title: "View all my service requests",
    }).render();

    const $contactMunicipality = new SimpleLinkBlock({
      href: "/",
      title: "Contact my municipality",
    }).render();

    const $submitAnotherRequest = new SimpleLinkBlock({
      href: "submit/",
      title: "Submit another service request",
    }).render();

    this.$element = $("<div />", {
      class: "service-request-submitted",
    });

    this.$element.append([
      new StatusMessage({
        text: "Service request submitted",
        status: "success",
      }).render(),
      $allServiceRequests,
      $contactMunicipality,
      $submitAnotherRequest,
    ]);
  }

  render() {
    return this.$element;
  }
}
