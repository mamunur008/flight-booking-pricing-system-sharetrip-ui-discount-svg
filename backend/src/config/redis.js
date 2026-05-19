import { createClient } from "redis";

const redisUrl =
  process.env.REDIS_URL ||
  `redis://:${process.env.REDIS_PASSWORD || "foobared"}@${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT || 6379}`;

export const redis = createClient({
  url: redisUrl,
});

redis.on("error", (error) => {
  console.error("[redis]", error.message);
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
