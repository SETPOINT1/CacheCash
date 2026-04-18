package com.cachecash.cli.infrastructure;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class EnvironmentConfig {
    private final Map<String, String> values;

    public EnvironmentConfig(Map<String, String> values) {
        this.values = values;
    }

    public static EnvironmentConfig load() {
        Path defaultPath = Paths.get("")
                .toAbsolutePath()
                .resolve("..")
                .resolve("..")
                .resolve("cachecash-config")
            .resolve(".env")
                .normalize();

        String envFilePath = System.getenv().getOrDefault("ENV_FILE_PATH", defaultPath.toString());
        Map<String, String> values = new HashMap<>();

        try {
            if (Files.exists(Path.of(envFilePath))) {
                for (String line : Files.readAllLines(Path.of(envFilePath))) {
                    if (line.isBlank() || line.startsWith("#") || !line.contains("=")) {
                        continue;
                    }

                    String[] parts = line.split("=", 2);
                    values.put(parts[0].trim(), parts[1].trim());
                }
            }
        } catch (IOException exception) {
            values.put("CONFIG_ERROR", exception.getMessage());
        }

        return new EnvironmentConfig(values);
    }

    public String get(String key, String fallback) {
        return values.getOrDefault(key, fallback);
    }
}
