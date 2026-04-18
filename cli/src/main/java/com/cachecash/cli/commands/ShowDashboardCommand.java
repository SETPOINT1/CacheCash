package com.cachecash.cli.commands;

import com.cachecash.cli.app.CommandContext;
import com.cachecash.cli.domain.DashboardSnapshot;

public class ShowDashboardCommand implements Command {
    @Override
    public void execute(CommandContext context) {
        DashboardSnapshot snapshot = context.scenarioService().getDashboardSnapshot();
        context.printer().printSection("Dashboard");
        context.printer().printLine("Organization: " + snapshot.organizationName());
        context.printer().printLine("Budget Utilization: " + snapshot.budgetUtilizationPercent() + "%");
        context.printer().printLine("Pending Approvals: " + snapshot.pendingApprovals());
        context.printer().printLine("Price Alerts: " + String.join(" | ", snapshot.priceAlerts()));
        context.printer().printLine("Policy Alerts: " + String.join(" | ", snapshot.policyAlerts()));
    }
}
