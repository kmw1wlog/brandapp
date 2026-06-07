import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function PageHeader({ title, subtitle, warning }: { title: string; subtitle: string; warning?: string }) {
  return (
    <header className="mb-5 border-b border-[#ddd2c0] pb-5">
      <h2 className="text-3xl font-black text-[#164033]">{title}</h2>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-[#655d52]">{subtitle}</p>
      {warning ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#fff6df] px-3 py-2 text-xs font-bold text-[#8a5a13]">
          <AlertTriangle size={15} />
          {warning}
        </p>
      ) : null}
    </header>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "warning" | "success" }) {
  const className = tone === "warning" ? "bg-[#fff0cf] text-[#805412]" : tone === "success" ? "bg-[#dff1e5] text-[#164033]" : "bg-[#eee6d8] text-[#574d42]";
  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${className}`}>{children}</span>;
}

export function Card({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) {
  return <section className={`rounded-lg border p-5 ${strong ? "border-[#164033] bg-[#164033] text-white" : "border-[#ddd2c0] bg-white"}`}>{children}</section>;
}

export function ActionLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link onClick={onClick} href={href} className="inline-flex items-center justify-center rounded-lg bg-[#b8642f] px-4 py-3 text-sm font-black text-white">
      {children}
    </Link>
  );
}
