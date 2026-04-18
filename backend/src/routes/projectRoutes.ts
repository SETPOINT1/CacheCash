import { Router } from "express";
import {
	createProjectSummary,
	getProjectSummary,
	listProjectSummaries,
} from "../controllers/projectController";

const projectRoutes = Router();

projectRoutes.get("/projects", listProjectSummaries);
projectRoutes.get("/projects/:projectId", getProjectSummary);
projectRoutes.post("/projects", createProjectSummary);

export { projectRoutes };
