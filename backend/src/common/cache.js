import { redis } from "../config/redis.js";
export async function getJson(key) {
  const v = await redis.get(key);
  return v ? JSON.parse(v) : null;
}
export async function setJson(key, val, seconds) {
  await redis.set(key, JSON.stringify(val), { EX: seconds });
}
export async function delPattern(pattern) {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(keys);
}
