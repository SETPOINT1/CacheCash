package com.cachecash.cli.app;

import com.cachecash.cli.infrastructure.ConsolePrinter;
import com.cachecash.cli.infrastructure.EnvironmentConfig;
import com.cachecash.cli.services.ScenarioService;

public record CommandContext(
        ScenarioService scenarioService,
        ConsolePrinter printer,
        EnvironmentConfig environmentConfig
) {
}
