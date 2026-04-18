package com.cachecash.cli.commands;

import com.cachecash.cli.app.CommandContext;

public class PlaceholderCommand implements Command {
    private final String message;

    public PlaceholderCommand(String message) {
        this.message = message;
    }

    @Override
    public void execute(CommandContext context) {
        context.printer().printLine(message);
    }
}
