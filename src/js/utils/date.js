/**
 * Converts and returns valid ISO date strings to locale date string
 * @param {String} isoDateString - The ISO date string to convert
 * @return {String} locale date string or error if provided date invalid
 */
export function getLocaleDateString(isoDateString) {
  try {
    return new Date(isoDateString).toLocaleDateString();
  } catch (error) {
    return "Invalid date format provided";
  }
}
