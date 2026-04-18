import { AppError } from "../errors/AppError";
import { analyzeReceipt } from "../integrations/ocrAdapter";

export interface OcrAnalysisResult {
  confidence: number;
  fileUrl: string;
  merchantName: string;
  receiptDate: string;
  totalAmount: number;
}

function parseOcrPayload(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("Request body must be an object", 400);
  }

  const body = payload as Record<string, unknown>;
  const fileUrl = typeof body.fileUrl === "string" ? body.fileUrl.trim() : "";

  if (!fileUrl) {
    throw new AppError("fileUrl is required", 400);
  }

  return { fileUrl };
}

export async function reviewReceipt(payload: unknown): Promise<OcrAnalysisResult> {
  const input = parseOcrPayload(payload);
  return analyzeReceipt(input.fileUrl);
}