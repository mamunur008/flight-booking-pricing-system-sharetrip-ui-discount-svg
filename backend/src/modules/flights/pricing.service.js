import * as configRepo from "../config/config.repository.js";
import { calculateDiscount } from "../discounts/discount.service.js";
function amount(type, value, base) {
  return type === "percent" ? base * (Number(value) / 100) : Number(value || 0);
}
function normalize(raw) {
  const arr = raw.Results || raw.results || raw.flights || [];
  return arr.map((f, i) => ({
    id: f.ResultID || f.id || `FL-${i}`,
    airlineCode: f.AirlineCode || f.airlineCode || f.airline || "BG",
    airlineName: f.AirlineName || f.airlineName || "Biman Bangladesh Airlines",
    baseFare: Number(
      f.BaseFare ?? f.baseFare ?? f.TotalFare ?? f.totalFare ?? 10000,
    ),
    totalTax: Number(f.TotalTax ?? f.tax ?? 0),
    currency: f.Currency || f.currency || "BDT",
    refundable: Boolean(f.IsRefundable ?? true),
    aircraft: f.Aircraft || "ATR 72",
    baggage: f.Baggage || "20 KG",
    segments: f.Segments || f.segments || [],
  }));
}
export async function applyPricing(raw, discountCode) {
  const rules = await configRepo.active();
  const flights = normalize(raw);
  const out = [];
  for (const f of flights) {
    const specific = rules.find(
      (r) => r.airline_code && r.airline_code === f.airlineCode,
    );
    const global = rules.find((r) => !r.airline_code);
    const rule = specific ||
      global || {
        markup_type: "percent",
        markup_value: 0,
        commission_type: "percent",
        commission_value: 0,
      };
    const supplierGross = f.baseFare + f.totalTax;
    const markup = amount(rule.markup_type, rule.markup_value, supplierGross);
    const NewBaseFare = Math.ceil(f.baseFare + markup);
    const commission = amount(
      rule.commission_type,
      rule.commission_value,
      f.baseFare,
    );
    const NewDiscount = Math.ceil(commission);
    const netFare = Math.ceil(NewBaseFare + f.totalTax);
    const grossFare = Math.ceil(NewBaseFare + f.totalTax + NewDiscount);
    const route = {
      origin: f.segments?.[0]?.Origin || f.segments?.[0]?.origin || "",
      destination:
        f.segments?.[0]?.Destination || f.segments?.[0]?.destination || "",
      airlineCode: f.airlineCode,
    };
    const d = await calculateDiscount(discountCode, route, grossFare);
    const customerPrice = Math.max(0, grossFare - d.discountAmount);
    out.push({
      id: f.id,
      airlineCode: f.airlineCode,
      airlineName: f.airlineName,
      currency: f.currency,
      refundable: f.refundable,
      aircraft: f.aircraft,
      baggage: f.baggage,
      segments: f.segments,
      NewBaseFare,
      NewDiscount,
      grossFare,
      netFare,
      customerPrice,
      discount: d,
      pricingRule: {
        id: rule.id,
        airline_code: rule.airline_code,
        markup_type: rule.markup_type,
        markup_value: rule.markup_value,
        commission_type: rule.commission_type,
        commission_value: rule.commission_value,
      },
    });
  }
  return {
    traceId: raw.TraceId || raw.traceId,
    count: out.length,
    flights: out,
    filter: buildFilter(out),
  };
}
export function buildFilter(flights) {
  const prices = flights.map((f) => f.customerPrice);
  return {
    min_price: Math.min(...prices, 0),
    max_price: Math.max(...prices, 0),
    fare_type: ["Refundable", "Non-Refundable"],
    airlines: [...new Set(flights.map((f) => f.airlineName))],
    airline_code: [...new Set(flights.map((f) => f.airlineCode))],
    aircraft: [...new Set(flights.map((f) => f.aircraft))],
    baggage: [...new Set(flights.map((f) => f.baggage))],
    onward_flight_stops: [0, 1, 2, 3],
    return_flight_stops: [0, 1, 2, 3],
    onward_depart_time: [
      "00:00 To 05:59",
      "06:00 To 11:59",
      "12:00 To 17:59",
      "18:00 To 23:59",
    ],
  };
}
export function filterFlights(body) {
  const flights = body.flights || [];
  const f = body.filter || {};
  return flights.filter(
    (x) =>
      (!f.min_price || x.customerPrice >= f.min_price) &&
      (!f.max_price || x.customerPrice <= f.max_price) &&
      (!f.airline_code?.length || f.airline_code.includes(x.airlineCode)),
  );
}
