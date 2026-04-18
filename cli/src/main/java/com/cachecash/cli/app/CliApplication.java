package com.cachecash.cli.app;

import com.cachecash.cli.infrastructure.ConsolePrinter;
import com.cachecash.cli.infrastructure.EnvironmentConfig;
import com.cachecash.cli.repositories.SampleDataRepository;
import com.cachecash.cli.services.ScenarioService;

public class CliApplication {
    public static void main(String[] args) {
        ConsolePrinter printer = new ConsolePrinter();
        EnvironmentConfig environmentConfig = EnvironmentConfig.load();
        ScenarioService scenarioService = new ScenarioService(new SampleDataRepository());
        CommandContext context = new CommandContext(scenarioService, printer, environmentConfig);
        CommandRouter router = new CommandRouter();

        printer.printSection("CacheCash CLI");
        printer.printLine("API Base URL: " + environmentConfig.get("CACHECASH_API_BASE_URL", "http://localhost:3000/api"));

        if (args.length == 0) {
            router.printHelp(context);
            return;
        }

        router.execute(args[0], context);
    }
}
