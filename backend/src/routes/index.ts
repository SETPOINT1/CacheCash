import { Router } from "express";
import { approvalRoutes } from "./approvalRoutes";
import { budgetRoutes } from "./budgetRoutes";
import { expenseRoutes } from "./expenseRoutes";
import { healthRoutes } from "./healthRoutes";
import { ocrRoutes } from "./ocrRoutes";
import { projectRoutes } from "./projectRoutes";

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use(projectRoutes);
apiRouter.use(budgetRoutes);
apiRouter.use(expenseRoutes);
apiRouter.use(approvalRoutes);
apiRouter.use(ocrRoutes);

export { apiRouter };
