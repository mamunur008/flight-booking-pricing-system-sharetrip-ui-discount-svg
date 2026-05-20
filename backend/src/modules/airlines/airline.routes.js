import axios from "axios";
import express from "express";

const router = express.Router();

router.get("/airlines", async (req, res, next) => {
  try {
    const { data } = await axios.get("https://uthaotrip.com/api/GetAirLines");

    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
