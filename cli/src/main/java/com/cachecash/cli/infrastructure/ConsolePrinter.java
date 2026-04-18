package com.cachecash.cli.infrastructure;

public class ConsolePrinter {
    public void printLine(String value) {
        System.out.println(value);
    }

    public void printSection(String title) {
        System.out.println();
        System.out.println("=== " + title + " ===");
    }
}
