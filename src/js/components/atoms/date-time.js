/**
 * Returns and HTML `time` element with the `datetime` attribute
 * set to the unformatted raw timestamp. It also sets the text
 * of the element to date formatted using `toLocaleDateString`
 * @param {String} datetime an unformatted Date string
 */
export const timeElem = (datetime) => {
  const $elem = $("<time />", {
    datetime: datetime,
    text: new Date(datetime).toLocaleDateString(),
  });
  return $elem;
};
