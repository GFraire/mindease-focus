import { useState } from "react";
import { Home, CheckSquare, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/auth-store";
import { Separator } from "../ui/separator";
import { SidebarItem } from "./sidebar-item";
import { BaseButton } from "../form/base-button";
import { makeLogoutUserUseCase } from "@/modules/auth/container";
import { CognitivePanel } from "../cognitive-panel";

import Logo from "@/shared/ui/assets/logo.svg?react";
import { useCognitiveSettingsStore } from "../../store/cognitive-settings-store";

export function Sidebar() {
  const logoutUserUseCase = makeLogoutUserUseCase();

  const user = useAuthStore((state) => state.user);
  const resetCognitiveSettings = useCognitiveSettingsStore(
    (state) => state.reset,
  );

  const [openSettings, setOpenSettings] = useState(false);

  async function handleLogout() {
    await logoutUserUseCase.execute();
    resetCognitiveSettings();
  }

  async function handleOpenSettings() {
    setOpenSettings(true);
  }

  return (
    <>
      <aside className="flex h-screen min-w-64 flex-col border-r border-border p-6 gap-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Logo className="h-6 w-6 text-primary" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-body font-bold text-high-contrast">
              MindEase Focus
            </h2>

            <span className="text-caption text-muted">{user?.fullName}</span>
          </div>
        </div>

        <Separator />

        <nav className="flex flex-1 flex-col gap-2">
          <SidebarItem to="/" icon={Home} label="Início" />
          <SidebarItem to="/tasks" icon={CheckSquare} label="Tarefas" />

          <div className="mt-auto flex flex-col gap-2">
            <Separator />
            
            <BaseButton
              className="cursor-pointer flex items-center gap-3 rounded-md justify-start text-muted hover:opacity-80 "
              variant="ghost"
              onClick={handleOpenSettings}
            >
              <Settings className="h-5! w-5! " />
              Configurações
            </BaseButton>

            <BaseButton
              className="cursor-pointer flex items-center gap-3 rounded-md justify-start text-red-400 transition-colors hover:bg-red-400/10 hover:text-red-400"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="h-5! w-5!" />
              Sair
            </BaseButton>
          </div>
        </nav>
      </aside>

      <CognitivePanel open={openSettings} onOpenChange={setOpenSettings} />
    </>
  );
}
