import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  response.status(statusCode).json({
    details: error instanceof AppError ? error.details : undefined,
    error: error.message || "Unexpected server error",
  });
}
