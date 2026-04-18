import { Request, Response } from "express";
import { decideApproval, getApprovals } from "../services/approvalService";
import { asyncHandler } from "../utils/asyncHandler";
import { ensureRouteParam } from "../validators/requestValidators";

export const listApprovalSteps = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await getApprovals(request.query) });
});

export const updateApprovalStep = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await decideApproval(ensureRouteParam(request.params.approvalId, "approvalId"), request.body) });
});