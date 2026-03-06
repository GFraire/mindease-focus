import { Sidebar } from "@/shared/ui/components/sidebar";
import { FocusNowCard } from "../components/focus-now-card";

export function Home() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />

      <div className="w-full flex flex-col p-8 gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-heading-lg font-bold text-high-contrast">
            Olá, como você está hoje?
          </h1>

          <span className="text-body text-muted">
            Aqui está o seu foco para este momento.
          </span>
        </div>

        <FocusNowCard title="Preparar apresentação de vendas" duration={60}  />
      </div>
    </div>
  );
}
