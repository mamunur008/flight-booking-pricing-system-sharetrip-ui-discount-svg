export function formatMoney(value, currency = "৳") {
  const amount = Number(value || 0);
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatTime(value, fallback = "07:15 AM") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
