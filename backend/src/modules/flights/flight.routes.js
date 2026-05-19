import crypto from "crypto";
import express from "express";
import { getJson, setJson } from "../../common/cache.js";
import { pool } from "../../config/db.js";
import { publishAudit } from "../../config/rabbit.js";
import { applyPricing, filterFlights } from "./pricing.service.js";
import {
  supplierAirlines,
  supplierCities,
  supplierSearch,
} from "./supplier.service.js";
const router = express.Router();
router.post("/flights/search", async (req, res, next) => {
  try {
    const key =
      "flight:" +
      crypto.createHash("sha1").update(JSON.stringify(req.body)).digest("hex");
    let raw = await getJson(key);
    if (!raw) {
      raw = await supplierSearch(req.body);
      await setJson(key, raw, 300);
    }
    const priced = await applyPricing(raw, req.body.discountCode);
    publishAudit({
      type: "flight.search",
      user: req.user?.id,
      at: new Date().toISOString(),
    });
    await pool.query(
      "INSERT INTO flight_search_logs(user_id,request_json,result_count) VALUES(?,?,?)",
      [req.user?.id || null, JSON.stringify(req.body), priced.count],
    );
    res.json(priced);
  } catch (e) {
    next(e);
  }
});
router.post("/filter", async (req, res, next) => {
  try {
    res.json({ flights: filterFlights(req.body) });
  } catch (e) {
    next(e);
  }
});
router.get("/airlines", async (req, res, next) => {
  try {
    const key = "airlines:all";
    let data = await getJson(key);
    if (!data) {
      data = await supplierAirlines();
      await setJson(key, data, 86400);
    }
    res.json(data);
  } catch (e) {
    next(e);
  }
});
router.get("/cities", async (req, res, next) => {
  try {
    const input = req.query.input || req.query.query || "";
    const key = "cities:" + input.toLowerCase();
    let data = await getJson(key);
    if (!data) {
      data = await supplierCities(input);
      await setJson(key, data, 43200);
    }
    res.json(data);
  } catch (e) {
    next(e);
  }
});
export default router;
