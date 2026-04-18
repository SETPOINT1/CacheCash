import { Router } from "express";
import {
	createExpenseNote,
	getExpenseNote,
	listExpenseNotes,
	submitExpenseNote,
} from "../controllers/expenseController";

const expenseRoutes = Router();

expenseRoutes.get("/expenses", listExpenseNotes);
expenseRoutes.get("/expenses/:expenseId", getExpenseNote);
expenseRoutes.post("/expenses", createExpenseNote);
expenseRoutes.post("/expenses/:expenseId/submit", submitExpenseNote);

export { expenseRoutes };

