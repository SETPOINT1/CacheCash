import { Request, Response } from "express";
import { reviewReceipt } from "../services/ocrService";
import { asyncHandler } from "../utils/asyncHandler";

export const analyzeReceiptImage = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await reviewReceipt(request.body) });
});