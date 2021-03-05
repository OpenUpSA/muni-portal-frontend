export function reverseChronologicalSortByDate(entries) {
  entries.sort((a, b) => {
    if (new Date(a.request_date) > new Date(b.request_date)) {
      return 1;
    }
    return 0;
  });

  return entries;
}
