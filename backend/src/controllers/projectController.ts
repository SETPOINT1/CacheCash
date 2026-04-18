import { Request, Response } from "express";
import { createProjectRecord, getProject, getProjects } from "../services/projectService";
import { asyncHandler } from "../utils/asyncHandler";
import { ensureRouteParam } from "../validators/requestValidators";

export const listProjectSummaries = asyncHandler(async (_request: Request, response: Response) => {
  response.json({ data: await getProjects() });
});

export const getProjectSummary = asyncHandler(async (request: Request, response: Response) => {
  response.json({ data: await getProject(ensureRouteParam(request.params.projectId, "projectId")) });
});

export const createProjectSummary = asyncHandler(async (request: Request, response: Response) => {
  response.status(201).json({ data: await createProjectRecord(request.body) });
});
