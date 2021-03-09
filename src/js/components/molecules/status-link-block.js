export class StatusLinkblock {
  constructor({ href, title, subtitle, status, statusClass }) {
    this.$element = $(".components .link-block--subtitle-status").clone();
    this.$element.attr("href", href);
    this.$element.find(".h3-block-title").text(title);
    this.$element.find(".subtitle").text(subtitle);

    const $statusBadge = this.$element.find(".link-block__status");
    $statusBadge.text(status);

    if (statusClass) {
      $statusBadge.addClass(statusClass);
    }
  }

  render() {
    return this.$element;
  }
}
