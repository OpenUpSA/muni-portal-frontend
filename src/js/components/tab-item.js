export class TabItem {
  constructor(tabContent) {
    this.$template = $(".styles .tab-link").first();
    this.$element = this.$template.clone();
    this.$element
      .find(".icon div")
      .removeClass("fas fa-spinner")
      .addClass(tabContent.icon);
    this.$element.find(".label").text(tabContent.title);
    this.$element.attr("href", tabContent.url);
  }

  /**
   * Sets the active tab
   * @param {JQuery} $tabsContainer - the tabs container element
   * @param {JQuery} $activeTabAnchor  - the active tab element
   */
  static setActiveTab($tabsContainer, $activeTabAnchor) {
    // Remove active from all
    const $tabs = $tabsContainer.find(".tab-link");
    $tabs.removeClass("active");
    $tabs.find(".tab-link__bg").removeClass("active");
    $tabs.find(".tab-link__base").removeClass("active");

    // Add active to specified
    $activeTabAnchor.addClass("active");
    //$activeTabAnchor.find(".tab-link__bg").addClass("active");
    $activeTabAnchor.find(".tab-link__base").addClass("active");
  }

  render() {
    return this.$element;
  }
}
