import { Request, Response } from "express";
import { getBudget, saveBudget } from "../services/budgetService";
import { asyncHandler } from "../utils/asyncHandler";
import { ensureRouteParam } from "../validators/requestValidators";

export const getProjectBudget = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await getBudget(ensureRouteParam(request.params.projectId, "projectId")) });
});

export const upsertProjectBudget = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await saveBudget(ensureRouteParam(request.params.projectId, "projectId"), request.body) });
});
