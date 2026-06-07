import { ComparisonHero } from "@/components/branch/ComparisonHero";
import { DecouplingBar } from "@/components/branch/DecouplingBar";
import { StartupInputSummary } from "@/components/branch/StartupInputSummary";
import { PageHeader } from "@/components/branch/Common";
import { getDashboardCopy } from "@/lib/branch/data";

export default function StartupNewPage() {
  const copy = getDashboardCopy().screens.main_comparison;
  return (
    <>
      <PageHeader title={copy.main_title} subtitle={copy.subtitle} warning={copy.warning_text} />
      <StartupInputSummary />
      <ComparisonHero />
      <DecouplingBar />
    </>
  );
}
