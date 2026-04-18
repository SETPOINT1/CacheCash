package com.cachecash.cli.commands;

import com.cachecash.cli.app.CommandContext;

public class ExportReportCommand implements Command {
    @Override
    public void execute(CommandContext context) {
        context.printer().printSection("Report Exported");
        context.printer().printLine(context.scenarioService().exportSummaryReport());
    }
}
