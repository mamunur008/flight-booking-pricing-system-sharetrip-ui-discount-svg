import { createClient } from "redis";

export const redis = createClient({
  url:
    process.env.REDIS_URL ||
    `redis://:${process.env.REDIS_PASSWORD || "foobared"}@${
      process.env.REDIS_HOST || "127.0.0.1"
    }:${process.env.REDIS_PORT || 6379}`,
});

redis.on("error", (e) => {
  console.error("[redis]", e.message);
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
