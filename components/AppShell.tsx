import { Sidebar } from "./Sidebar";
import { Stepper } from "./Stepper";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <Topbar />
        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <Stepper />
          {children}
        </main>
      </div>
    </div>
  );
}
