export function formatPrice(value: number, suffix = " DH TTC") {
  return `${new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: value % 1 === 0 ? 2 : 2,
    maximumFractionDigits: 2
  }).format(value)}${suffix}`;
}
