/**
 * Returns a modal header with a click event attached to the
 * close icon that will close the modal.
 * @param {string} title - title of the modal
 * @param {jqObject} $element - The modal element
 */
export const getModalHeader = (title, $element) => {
  const $modalHeader = $(".styles .page-heading--icon-left").clone();
  // the above consists of three elements
  // 1. An icon aligned to the left
  const $icon = $modalHeader.find(".page__icon");
  // 2. A page title
  const $modalTitle = $modalHeader.find(".page-title");
  // 3. A close icon
  const $modalClose = $modalHeader.find(".page-close__icon");

  $icon.hide();
  $modalTitle.text(title);

  if ($modalClose) {
    $modalClose.click((event) => {
      // as this is currently an anchor, preventDefault
      event.preventDefault();
      window.location = "/";
    });
  }

  return $modalHeader;
};
