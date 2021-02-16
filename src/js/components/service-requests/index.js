import { CurrentServiceRequests } from "./current-service-requests";
import { ClosedServiceRequests } from "./closed-service-requests";

export class ServiceRequestsIndex {
  constructor() {
    const $gridThirds = $(".components .grid--thirds").clone();
    const $submitServiceRequestLink = $(".components .action-block").clone();
    const $icon = $submitServiceRequestLink.find(".fas");
    const $label = $submitServiceRequestLink.find(".label");

    this.$element = $(".components .grid--fullwidth").clone();

    $icon.removeClass("fa-spinner").addClass("fa-plus");
    $label.text("Submit a new service request");

    $gridThirds.append($submitServiceRequestLink);

    this.$element.append($gridThirds);
    this.$element.append(new CurrentServiceRequests().render());
    this.$element.append(new ClosedServiceRequests().render());
  }

  render() {
    return this.$element;
  }
}
