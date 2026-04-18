package com.cachecash.cli.commands;

import com.cachecash.cli.app.CommandContext;
import com.cachecash.cli.domain.ExpenseNoteSummary;

public class SubmitExpenseCommand implements Command {
    @Override
    public void execute(CommandContext context) {
        ExpenseNoteSummary expenseNote = context.scenarioService().submitExpense();
        context.printer().printSection("Expense Submitted");
        context.printer().printLine("ID: " + expenseNote.id());
        context.printer().printLine("Description: " + expenseNote.description());
        context.printer().printLine("Amount: " + expenseNote.amount());
        context.printer().printLine("Category: " + expenseNote.category());
        context.printer().printLine("Price Signal: " + expenseNote.priceSignal());
        context.printer().printLine("Policy Signal: " + expenseNote.policySignal());
        context.printer().printLine("Status: " + expenseNote.status());
    }
}
