import { SimpleLinkBlock } from "../molecules/simple-link-block";

export class ServiceRequestSubmitted {
  constructor() {
    const $successMessage = $(".components .basic-block--status");
    $successMessage
      .find(".fa-icon")
      .removeClass("fa-spinner")
      .addClass("fa-check");
    $successMessage.find(".status-text").text("Service request submitted");
    $successMessage.addClass("basic-block--status--success");

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
      $successMessage,
      $allServiceRequests,
      $contactMunicipality,
      $submitAnotherRequest,
    ]);
  }

  render() {
    return this.$element;
  }
}
