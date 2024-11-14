export function convertNumbersToStrings(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      [key, typeof value === 'number' ? value.toString() : value]
    )
  );
}