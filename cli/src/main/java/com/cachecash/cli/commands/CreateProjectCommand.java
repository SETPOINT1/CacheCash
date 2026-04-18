package com.cachecash.cli.commands;

import com.cachecash.cli.app.CommandContext;
import com.cachecash.cli.domain.Project;

public class CreateProjectCommand implements Command {
    @Override
    public void execute(CommandContext context) {
        Project project = context.scenarioService().createProject();
        context.printer().printSection("Project Created");
        context.printer().printLine("ID: " + project.id());
        context.printer().printLine("Name: " + project.name());
        context.printer().printLine("Owner: " + project.ownerName());
        context.printer().printLine("Status: " + project.status());
    }
}
