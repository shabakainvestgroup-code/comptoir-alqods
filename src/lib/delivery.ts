export const DELIVERY_FEES = {
  marrakech: 30,
  outsideMarrakech: 60,
  pickup: 0
};

export function calculateDeliveryFee(city: string, method = "home") {
  if (method === "pickup") return DELIVERY_FEES.pickup;
  return city.trim().toLowerCase() === "marrakech"
    ? DELIVERY_FEES.marrakech
    : DELIVERY_FEES.outsideMarrakech;
}
