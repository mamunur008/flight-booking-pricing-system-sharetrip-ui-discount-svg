import express from "express";
import * as repo from "./discount.repository.js";
const router = express.Router();
router.get("/", async (req, res, next) => {
  try {
    res.json(await repo.list());
  } catch (e) {
    next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await repo.create(req.body));
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    await repo.remove(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
});
export default router;
