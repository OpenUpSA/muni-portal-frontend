export class StatusMessage {
  constructor({ text, status }) {
    const statusUI = {
      success: {
        cssClass: "basic-block--status--success",
        icon: "fa-check",
      },
      warning: {
        cssClass: "basic-block--status--warning",
        icon: "fa-exclamation-triangle",
      },
      failure: {
        cssClass: "basic-block--status--failure",
        icon: "fa-times",
      },
    };

    this.$element = $(".components .basic-block--status");
    this.$element
      .find(".fa-icon")
      .removeClass("fa-spinner")
      .addClass(statusUI[status].icon);
    this.$element.find(".status-text").text(text);
    this.$element.addClass(statusUI[status].cssClass);
  }

  render() {
    return this.$element;
  }
}
