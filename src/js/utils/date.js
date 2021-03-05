/**
 * Converts and returns valid ISO date strings to locale date string.
 * This excludes the time and only returns the date
 * @param {String} isoDateString - The ISO date string to convert
 * @param {boolean} [stripTime] - Exclude the time from date string [default: true]
 * @return {String} locale date string or error if provided date invalid
 */
export function getDateString(isoDateString, stripTime = true) {
  try {
    if (stripTime) {
      return new Date(isoDateString).toLocaleDateString();
    }
    return new Date(isoDateString).toLocaleString();
  } catch (error) {
    return "Invalid date format provided";
  }
}
