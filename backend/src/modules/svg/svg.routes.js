import express from "express";
import multer from "multer";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { downloadSvgPng, uploadSvg } from "./svg.controller.js";

const router = express.Router();
const upload = multer();

router.post("/upload/svg", authMiddleware, upload.none(), uploadSvg);
router.get("/svg/download/:fileName", authMiddleware, downloadSvgPng);

export default router;
