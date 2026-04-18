package com.cachecash.cli.domain;

public record ExpenseNoteSummary(
        String id,
        String description,
        double amount,
        String category,
        String priceSignal,
        String policySignal,
        String status
) {
}
