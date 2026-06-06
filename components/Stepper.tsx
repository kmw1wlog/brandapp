"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STEPS } from "@/lib/constants";

export function Stepper() {
  const pathname = usePathname();
  const active = Math.max(0, STEPS.findIndex((step) => pathname.startsWith(step.href)));

  return (
    <nav className="no-print mb-6 overflow-x-auto rounded-3xl bg-white/80 p-3 shadow-soft">
      <ol className="flex min-w-max gap-2">
        {STEPS.map((step, index) => (
          <li key={step.href}>
            <Link
              href={step.href}
              className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold transition ${
                index === active ? "bg-forest text-cream" : index < active ? "bg-moss/10 text-forest" : "bg-cream text-forest/60"
              }`}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">{index + 1}</span>
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
