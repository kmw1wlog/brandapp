import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary: "bg-[color:var(--branch-primary)] text-white hover:bg-[color:var(--branch-primary-strong)]",
  secondary: "border border-[color:var(--branch-border)] bg-white text-[color:var(--branch-ink)] hover:bg-[color:var(--branch-surface-muted)]",
  ghost: "text-[color:var(--branch-ink-muted)] hover:bg-[color:var(--branch-surface-muted)]"
};

export function BranchButton({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant; href?: string }) {
  const classes = `inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-black transition ${variantClass[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
