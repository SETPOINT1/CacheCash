package com.cachecash.cli.domain;

import java.util.List;

public record DashboardSnapshot(
        String organizationName,
        double budgetUtilizationPercent,
        int pendingApprovals,
        List<String> priceAlerts,
        List<String> policyAlerts
) {
}
