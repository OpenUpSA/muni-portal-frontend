export class TabItem {
  constructor(tabContent) {
    this.$template = $(".components .tab-link").first();
    this.$element = this.$template.clone();

    /*
     * This is the icon for the services tab. Instead of
     * using a single FontAwesome icon, this uses a
     * combination of four wrapped in a container `div`
     * element so, we need to treat it differently.
     */
    if (tabContent.icon.indexOf(".icon--grid") > -1) {
      const servicesIconGrid = $(tabContent.icon);
      this.$element.find(".icon").empty().append(servicesIconGrid);
    } else {
      this.$element
        .find(".icon div")
        .removeClass("fas fa-spinner")
        .addClass(tabContent.icon);
    }

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
