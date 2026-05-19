import * as repo from "./discount.repository.js";
export async function calculateDiscount(code, flight, fare) {
  if (!code)
    return { discountCode: null, discountAmount: 0, discountMessage: null };
  const d = await repo.findActive(code.toUpperCase().trim());
  if (!d)
    return {
      discountCode: code,
      discountAmount: 0,
      discountMessage: "Invalid or expired discount code",
    };
  if (d.usage_limit && d.used_count >= d.usage_limit)
    return {
      discountCode: code,
      discountAmount: 0,
      discountMessage: "Discount usage limit exceeded",
    };
  if (Number(fare) < Number(d.min_fare || 0))
    return {
      discountCode: code,
      discountAmount: 0,
      discountMessage: "Minimum fare not reached",
    };
  if (d.airline_code && d.airline_code !== flight.airlineCode)
    return {
      discountCode: code,
      discountAmount: 0,
      discountMessage: "Discount not valid for this airline",
    };
  if (d.origin && d.origin !== flight.origin)
    return {
      discountCode: code,
      discountAmount: 0,
      discountMessage: "Discount not valid for this route",
    };
  if (d.destination && d.destination !== flight.destination)
    return {
      discountCode: code,
      discountAmount: 0,
      discountMessage: "Discount not valid for this route",
    };
  let amount =
    d.discount_type === "percent"
      ? fare * (Number(d.discount_value) / 100)
      : Number(d.discount_value);
  if (d.max_discount) amount = Math.min(amount, Number(d.max_discount));
  return {
    discountCode: d.code,
    discountAmount: Math.ceil(amount),
    discountMessage: d.description,
  };
}
