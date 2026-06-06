import { AppShell } from "@/components/AppShell";

export default function StartupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
