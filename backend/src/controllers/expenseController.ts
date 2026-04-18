import { Request, Response } from "express";
import { createExpenseRecord, getExpense, getExpenses, submitExpenseRecord } from "../services/expenseService";
import { asyncHandler } from "../utils/asyncHandler";
import { ensureRouteParam } from "../validators/requestValidators";

export const listExpenseNotes = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await getExpenses(request.query) });
});

export const getExpenseNote = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await getExpense(ensureRouteParam(request.params.expenseId, "expenseId")) });
});

export const createExpenseNote = asyncHandler(async (request: Request, response: Response) => {
  response.status(201).json({ data: await createExpenseRecord(request.body) });
});

export const submitExpenseNote = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await submitExpenseRecord(ensureRouteParam(request.params.expenseId, "expenseId"), request.body) });
});

