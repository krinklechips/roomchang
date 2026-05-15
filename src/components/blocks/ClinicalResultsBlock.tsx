import { getClinicalCases } from "@/lib/data";
import { ClinicalResultsGrid } from "@/components/sections/clinical-results-grid";

export async function ClinicalResultsBlock() {
  const cases = await getClinicalCases();
  return <ClinicalResultsGrid cases={cases} />;
}
