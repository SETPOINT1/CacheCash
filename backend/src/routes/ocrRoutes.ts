import { Router } from "express";
import { analyzeReceiptImage } from "../controllers/ocrController";

const ocrRoutes = Router();

ocrRoutes.post("/ocr/analyze", analyzeReceiptImage);

export { ocrRoutes };