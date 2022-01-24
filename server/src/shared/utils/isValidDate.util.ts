export function isValidDate(date: any) {
  return (
    (isNaN(date) && !isNaN(Date.parse(date))) ||
    (date instanceof Date && !isNaN(date.getTime()))
  );
}
