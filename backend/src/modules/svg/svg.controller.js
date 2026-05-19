import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const STORAGE_ROOT = path.join(process.cwd(), "storage");
const SVG_DIR = path.join(STORAGE_ROOT, "svg");
const PNG_DIR = path.join(STORAGE_ROOT, "exports");

async function ensureStorageFolders() {
  await fs.mkdir(SVG_DIR, { recursive: true });
  await fs.mkdir(PNG_DIR, { recursive: true });
}

export async function uploadSvg(req, res, next) {
  try {
    await ensureStorageFolders();

    const name = req.body.name;
    const title = req.body.title;
    const description = req.body.description;
    const svgContent = req.body.svgContent || req.body.svg_content;

    if (!name || !title || !description || !svgContent) {
      return res.status(400).json({
        message: "name, title, description and svgContent are required",
      });
    }

    const id = crypto.randomUUID();

    const finalSvg = svgContent
      .replaceAll("{{name}}", name)
      .replaceAll("{{title}}", title)
      .replaceAll("{{description}}", description);

    const svgFileName = `${id}.svg`;
    const pngFileName = `${id}.png`;

    const svgPath = path.join(SVG_DIR, svgFileName);
    const pngPath = path.join(PNG_DIR, pngFileName);

    await fs.writeFile(svgPath, finalSvg, "utf8");

    await sharp(Buffer.from(finalSvg)).png().toFile(pngPath);

    return res.status(200).json({
      message: "PNG generated",
      fileName: pngFileName,
      downloadUrl: `/api/svg/download/${pngFileName}`,
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadSvgPng(req, res, next) {
  try {
    const { fileName } = req.params;

    if (!fileName || !fileName.endsWith(".png")) {
      return res.status(400).json({
        message: "Invalid PNG file name",
      });
    }

    const filePath = path.join(PNG_DIR, fileName);

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        message: "PNG file not found",
      });
    }

    return res.download(filePath, fileName);
  } catch (error) {
    next(error);
  }
}
