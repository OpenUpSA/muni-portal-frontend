export class CurrentServiceRequests {
  constructor() {
    const $sectionHeading = $(".components .section-heading").clone();
    const $noItemsMessage = $(".components .basic-block:eq(0)").clone();

    this.$element = $(".components .grid--fullwidth").clone();

    $sectionHeading.find(".section-title").text("Current service requests");
    $noItemsMessage.find(".h3-block-title").text("No current requests");

    this.$element.append([$sectionHeading, $noItemsMessage]);
  }

  render() {
    return this.$element;
  }
}
