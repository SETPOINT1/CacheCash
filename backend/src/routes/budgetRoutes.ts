import { Router } from "express";
import { getProjectBudget, upsertProjectBudget } from "../controllers/budgetController";

const budgetRoutes = Router();

budgetRoutes.get("/projects/:projectId/budget", getProjectBudget);
budgetRoutes.put("/projects/:projectId/budget", upsertProjectBudget);

export { budgetRoutes };
