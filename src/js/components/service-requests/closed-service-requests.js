export class ClosedServiceRequests {
  constructor() {
    const $sectionHeading = $(".components .section-heading").clone();
    const $noItemsMessage = $(".components .basic-block:eq(0)").clone();

    this.$element = $(".components .grid--default").clone();

    $sectionHeading.find(".section-title").text("Closed service requests");
    $noItemsMessage.find(".h3-block-title").text("No closed requests");

    this.$element.append([$sectionHeading, $noItemsMessage]);
  }

  render() {
    return this.$element;
  }
}
