import { BranchAppShell } from "@/components/branch/BranchAppShell";

export default function StartupLayout({ children }: { children: React.ReactNode }) {
  return <BranchAppShell>{children}</BranchAppShell>;
}
