import { AppError } from "../errors/AppError";

export function ensurePositiveAmount(amount: number) {
  return Number.isFinite(amount) && amount > 0;
}

export function ensureRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`${fieldName} is required`, 400);
  }

  return value.trim();
}

export function ensureOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new AppError("Invalid string payload", 400);
  }

  return value.trim();
}

export function ensureNumber(value: unknown, fieldName: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new AppError(`${fieldName} must be a valid number`, 400);
  }

  return parsed;
}

export function ensureStringArray(value: unknown, fieldName: string): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new AppError(`${fieldName} must be an array of strings`, 400);
  }

  return value;
}

export function ensureRouteParam(value: unknown, fieldName: string): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  throw new AppError(`${fieldName} route parameter is required`, 400);
}

