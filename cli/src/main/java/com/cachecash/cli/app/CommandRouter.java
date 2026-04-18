package com.cachecash.cli.app;

import com.cachecash.cli.commands.Command;
import com.cachecash.cli.commands.CreateProjectCommand;
import com.cachecash.cli.commands.ExportReportCommand;
import com.cachecash.cli.commands.InitOrgCommand;
import com.cachecash.cli.commands.PlaceholderCommand;
import com.cachecash.cli.commands.ShowDashboardCommand;
import com.cachecash.cli.commands.SubmitExpenseCommand;

import java.util.LinkedHashMap;
import java.util.Map;

public class CommandRouter {
    private final Map<String, Command> commands = new LinkedHashMap<>();

    public CommandRouter() {
        commands.put("init-org", new InitOrgCommand());
        commands.put("create-project", new CreateProjectCommand());
        commands.put("allocate-budget", new PlaceholderCommand("allocate-budget scaffold is ready for implementation."));
        commands.put("add-policy", new PlaceholderCommand("add-policy scaffold is ready for implementation."));
        commands.put("submit-expense", new SubmitExpenseCommand());
        commands.put("attach-receipt", new PlaceholderCommand("attach-receipt scaffold is ready for implementation."));
        commands.put("add-quote", new PlaceholderCommand("add-quote scaffold is ready for implementation."));
        commands.put("run-price-check", new PlaceholderCommand("run-price-check scaffold is ready for implementation."));
        commands.put("run-policy-check", new PlaceholderCommand("run-policy-check scaffold is ready for implementation."));
        commands.put("approve-expense", new PlaceholderCommand("approve-expense scaffold is ready for implementation."));
        commands.put("show-dashboard", new ShowDashboardCommand());
        commands.put("export-report", new ExportReportCommand());
    }

    public void execute(String commandName, CommandContext context) {
        Command command = commands.get(commandName);

        if (command == null) {
            context.printer().printLine("Unknown command: " + commandName);
            printHelp(context);
            return;
        }

        command.execute(context);
    }

    public void printHelp(CommandContext context) {
        context.printer().printSection("Available Commands");

        for (String commandName : commands.keySet()) {
            context.printer().printLine("- " + commandName);
        }
    }
}
