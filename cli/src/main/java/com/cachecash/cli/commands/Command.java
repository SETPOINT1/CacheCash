package com.cachecash.cli.commands;

import com.cachecash.cli.app.CommandContext;

public interface Command {
    void execute(CommandContext context);
}
