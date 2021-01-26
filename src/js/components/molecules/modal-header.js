/**
 * Returns a modal header with a click event attached to the
 * close icon that will close the modal.
 * @param {string} title - title of the modal
 * @param {jqObject} $element - The modal element
 */
export const getModalHeader = (title, $element) => {
  const $modalHeader = $(".styles .page-heading").clone();
  // the above consists of two elements
  // 1. A page title
  const $modalTitle = $modalHeader.find(".page-title").empty();
  // 2. A close icon
  const $modalClose = $modalHeader.find(".page-close__icon");

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
