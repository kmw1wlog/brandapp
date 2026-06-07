import type { SignageRequirements } from "@/lib/branch/types";

export function SignageDirectionCard({ signage }: { signage: SignageRequirements }) {
  const main = signage.main_sign as { type: string; copy: string; recommended_width_mm: number };
  const projecting = signage.projecting_sign as { type: string; copy: string; diameter_mm: number };
  return (
    <section className="rounded-lg border border-[#ddd2c0] bg-white p-5">
      <h3 className="text-lg font-black text-[#164033]">간판 방향</h3>
      <p className="mt-3 text-sm font-bold">{main.type}: {main.copy} ({main.recommended_width_mm}mm)</p>
      <p className="mt-2 text-sm">{projecting.type}: {projecting.copy} ({projecting.diameter_mm}mm)</p>
      <p className="mt-3 text-sm text-[#655d52]">{signage.permit_note}</p>
      <p className="mt-3 text-xs font-bold text-[#655d52]">견적 체크: {signage.quote_checklist.join(", ")}</p>
    </section>
  );
}
