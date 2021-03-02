import { API } from "../../api";
import { OPEN_SERVICE_REQUEST_STATUSES } from "../constants";

import { LoadingPlaceholder } from "../atoms/loading-placeholder";
import { CurrentServiceRequests } from "./current-service-requests";
import { ClosedServiceRequests } from "./closed-service-requests";

export class ServiceRequestsIndex {
  constructor() {
    const api = new API();
    const $gridThirds = $(".components .grid--thirds").clone();
    const $loadingPlaceholder = new LoadingPlaceholder();
    const $submitServiceRequestLink = $(".components .action-block").clone();
    const $icon = $submitServiceRequestLink.find(".fas");
    const $label = $submitServiceRequestLink.find(".label");

    this.$element = $(".components .grid--default").clone();

    $icon.removeClass("fa-spinner").addClass("fa-plus");
    $label.text("Submit a new service request");
    $submitServiceRequestLink.attr("href", "submit");

    $gridThirds.append($submitServiceRequestLink);

    this.$element.append($gridThirds);
    this.$element.append($loadingPlaceholder.render());

    api
      .getServiceRequests()
      .then((serviceRequests) => {
        $loadingPlaceholder.remove();

        const openRequests = serviceRequests.filter((request) =>
          OPEN_SERVICE_REQUEST_STATUSES.includes(request.status)
        );

        const closedRequests = serviceRequests.filter(
          (request) => !OPEN_SERVICE_REQUEST_STATUSES.includes(request.status)
        );

        this.$element.append(new CurrentServiceRequests(openRequests).render());
        this.$element.append(
          new ClosedServiceRequests(closedRequests).render()
        );
      })
      .fail((a, b) => console.error(a, b));
  }

  render() {
    return this.$element;
  }
}
