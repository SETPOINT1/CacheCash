export function getHealthSummary() {
  return {
    database: "supabase",
    modules: ["organization", "project", "budget", "expense", "approval", "report", "ocr"],
    status: "ok",
    version: "1.1.0-supabase",
  };
}
