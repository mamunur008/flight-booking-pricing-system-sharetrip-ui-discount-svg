import dotenv from "dotenv";
import { app } from "./app.js";
import { connectRabbit } from "./config/rabbit.js";
import { connectRedis } from "./config/redis.js";
dotenv.config();
const port = process.env.PORT || 5000;
await connectRedis();
await connectRabbit();
app.listen(port, () => console.log(`Backend running on ${port}`));
