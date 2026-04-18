import { AppError } from "../errors/AppError";
import { CreateProjectInput } from "../models/project";
import { createProject, findProjectById, listProjects } from "../repositories/projectRepository";
import { ensureNumber, ensureOptionalString, ensureRequiredString } from "../validators/requestValidators";

function parseCreateProjectInput(payload: unknown): CreateProjectInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AppError("Request body must be an object", 400);
  }

  const body = payload as Record<string, unknown>;

  return {
    memberCount: body.memberCount === undefined ? 1 : ensureNumber(body.memberCount, "memberCount"),
    name: ensureRequiredString(body.name, "name"),
    organizationId: ensureRequiredString(body.organizationId, "organizationId"),
    ownerId: ensureRequiredString(body.ownerId, "ownerId"),
    ownerName: ensureOptionalString(body.ownerName) ?? "Unknown Owner",
    status: "DRAFT",
  };
}

export async function getProjects() {
  return listProjects();
}

export async function getProject(projectId: string) {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
}

export async function createProjectRecord(payload: unknown) {
  return createProject(parseCreateProjectInput(payload));
}
