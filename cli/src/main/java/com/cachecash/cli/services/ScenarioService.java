package com.cachecash.cli.services;

import com.cachecash.cli.domain.DashboardSnapshot;
import com.cachecash.cli.domain.ExpenseNoteSummary;
import com.cachecash.cli.domain.Organization;
import com.cachecash.cli.domain.Project;
import com.cachecash.cli.repositories.SampleDataRepository;

public class ScenarioService {
    private final SampleDataRepository sampleDataRepository;

    public ScenarioService(SampleDataRepository sampleDataRepository) {
        this.sampleDataRepository = sampleDataRepository;
    }

    public Organization initializeOrganization() {
        return sampleDataRepository.getOrganization();
    }

    public Project createProject() {
        return sampleDataRepository.getProject();
    }

    public ExpenseNoteSummary submitExpense() {
        return sampleDataRepository.getExpenseNote();
    }

    public DashboardSnapshot getDashboardSnapshot() {
        return sampleDataRepository.getDashboardSnapshot();
    }

    public String exportSummaryReport() {
        return "Generated summary report for April 2026 with price warnings and policy exceptions.";
    }
}
