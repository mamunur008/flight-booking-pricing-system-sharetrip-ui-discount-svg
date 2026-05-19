import axios from "axios";
const BASE = process.env.SUPPLIER_BASE_URL || "https://uthaotrip.com/api";
export async function supplierSearch(payload) {
  try {
    const { data } = await axios.post(
      `${BASE}/air/UnauthorizeSearchAir`,
      payload,
      { timeout: 12000 },
    );
    return data;
  } catch (e) {
    console.warn(
      "Supplier unavailable, returning interview mock data:",
      e.message,
    );
    return mockFlights(payload);
  }
}
export async function supplierAirlines() {
  try {
    const { data } = await axios.get(`${BASE}/GetAirLines`, { timeout: 10000 });
    return data;
  } catch {
    return [
      { Code: "BG", Name: "Biman Bangladesh Airlines" },
      { Code: "VQ", Name: "NOVOAIR" },
      { Code: "BS", Name: "US-Bangla Airlines" },
      { Code: "2A", Name: "Air Astra" },
    ];
  }
}
export async function supplierCities(input) {
  try {
    const { data } = await axios.get(
      `${BASE}/Auto/GetCities/?input=${encodeURIComponent(input)}`,
      { timeout: 10000 },
    );
    return data;
  } catch {
    return [
      { Code: "DAC", Name: "Dhaka", Country: "Bangladesh" },
      { Code: "CXB", Name: "Cox's Bazar", Country: "Bangladesh" },
      { Code: "DXB", Name: "Dubai", Country: "UAE" },
      { Code: "SIN", Name: "Singapore", Country: "Singapore" },
    ].filter((x) =>
      JSON.stringify(x).toLowerCase().includes(String(input).toLowerCase()),
    );
  }
}
function mockFlights(p) {
  const airlines = [
    ["BG", "Biman Bangladesh Airlines", 11200],
    ["VQ", "NOVOAIR", 11623],
    ["BS", "US-Bangla Airlines", 11680],
    ["2A", "Air Astra", 11864],
  ];
  return {
    TraceId: "mock-" + Date.now(),
    Results: airlines.map((a, i) => ({
      ResultID: "R" + i,
      AirlineCode: a[0],
      AirlineName: a[1],
      BaseFare: a[2],
      TotalTax: 320 + i * 70,
      Currency: "BDT",
      IsRefundable: i !== 2,
      Aircraft: "ATR 72",
      Baggage: "20 KG",
      Segments: [
        {
          Origin: p.Origin || "DAC",
          Destination: p.Destination || "CXB",
          DepartureTime:
            "2026-05-14T" + String(7 + i * 2).padStart(2, "0") + ":15:00",
          ArrivalTime:
            "2026-05-14T" + String(8 + i * 2).padStart(2, "0") + ":20:00",
          Stops: 0,
          DurationMinutes: 65,
        },
        {
          Origin: p.Destination || "CXB",
          Destination: p.Origin || "DAC",
          DepartureTime: "2026-05-16T13:25:00",
          ArrivalTime: "2026-05-16T14:30:00",
          Stops: 0,
          DurationMinutes: 65,
        },
      ],
    })),
  };
}
