export function getStepGridClass(itemCount: number) {
  if (itemCount === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  if (itemCount === 5 || itemCount === 6) return "sm:grid-cols-2 lg:grid-cols-3";
  return "sm:grid-cols-2 lg:grid-cols-4";
}
