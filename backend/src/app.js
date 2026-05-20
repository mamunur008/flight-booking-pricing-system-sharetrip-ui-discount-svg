import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { authRequired } from "./common/authMiddleware.js";
import { errorHandler } from "./common/errorHandler.js";
import airlineRoutes from "./modules/airlines/airline.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import configRoutes from "./modules/config/config.routes.js";
import discountRoutes from "./modules/discounts/discount.routes.js";
import flightRoutes from "./modules/flights/flight.routes.js";
import svgRoutes from "./modules/svg/svg.routes.js";
export const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "3mb" }));
app.use(rateLimit({ windowMs: 60000, limit: 300 }));
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", architecture: "modular-monolith" }),
);
app.use("/api/auth", authRoutes);
app.use("/api", authRequired, flightRoutes);
app.use("/api/config", authRequired, configRoutes);
app.use("/api/discounts", authRequired, discountRoutes);
app.use("/api", authRequired, svgRoutes);
app.use("/api", authRequired, airlineRoutes);
app.use(errorHandler);
