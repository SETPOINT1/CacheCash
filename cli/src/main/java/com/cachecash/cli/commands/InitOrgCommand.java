package com.cachecash.cli.commands;

import com.cachecash.cli.app.CommandContext;
import com.cachecash.cli.domain.Organization;

public class InitOrgCommand implements Command {
    @Override
    public void execute(CommandContext context) {
        Organization organization = context.scenarioService().initializeOrganization();
        context.printer().printSection("Organization Initialized");
        context.printer().printLine("ID: " + organization.id());
        context.printer().printLine("Name: " + organization.name());
        context.printer().printLine("Currency: " + organization.currency());
    }
}
