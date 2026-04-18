import { Router } from "express";
import { listApprovalSteps, updateApprovalStep } from "../controllers/approvalController";

const approvalRoutes = Router();

approvalRoutes.get("/approvals", listApprovalSteps);
approvalRoutes.patch("/approvals/:approvalId", updateApprovalStep);

export { approvalRoutes };