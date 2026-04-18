package com.cachecash.cli.repositories;

import com.cachecash.cli.domain.DashboardSnapshot;
import com.cachecash.cli.domain.ExpenseNoteSummary;
import com.cachecash.cli.domain.Organization;
import com.cachecash.cli.domain.Project;

import java.util.List;

public class SampleDataRepository {
    public Organization getOrganization() {
        return new Organization("org-001", "CacheCash Student Procurement Team", "THB");
    }

    public Project getProject() {
        return new Project("project-001", "Orientation Fair 2026", "Nina", "ACTIVE");
    }

    public ExpenseNoteSummary getExpenseNote() {
        return new ExpenseNoteSummary(
                "expense-001",
                "Printed banners and booth signage",
                3850.0,
                "SUPPLIES",
                "WARNING",
                "PASS",
                "PENDING_APPROVAL"
        );
    }

    public DashboardSnapshot getDashboardSnapshot() {
        return new DashboardSnapshot(
                "CacheCash Student Procurement Team",
                69.0,
                8,
                List.of(
                        "Booth supplies cost is 14 percent above recent average",
                        "Van rental has a cheaper historical vendor"
                ),
                List.of(
                        "Travel category is near threshold",
                        "One expense requires a supporting quote"
                )
        );
    }
}
