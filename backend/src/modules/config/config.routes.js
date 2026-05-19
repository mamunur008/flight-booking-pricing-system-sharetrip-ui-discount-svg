import express from "express";
import { delPattern } from "../../common/cache.js";
import * as repo from "./config.repository.js";
const router = express.Router();
router.get("/lists", async (req, res, next) => {
  try {
    res.json(await repo.list());
  } catch (e) {
    next(e);
  }
});
router.post("/create", async (req, res, next) => {
  try {
    const row = await repo.create(req.body);
    await delPattern("pricing:*");
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
});
router.patch("/edit", async (req, res, next) => {
  try {
    const row = await repo.update(req.query.id, req.body);
    await delPattern("pricing:*");
    res.json(row);
  } catch (e) {
    next(e);
  }
});
router.delete("/delete", async (req, res, next) => {
  try {
    await repo.remove(req.query.id);
    await delPattern("pricing:*");
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
});
export default router;
