import { useState } from "react";
import { Home, CheckSquare, Settings, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/auth-store";
import { Separator } from "../ui/separator";
import { SidebarItem } from "./sidebar-item";
import { BaseButton } from "../form/base-button";
import { makeLogoutUserUseCase } from "@/modules/auth/container";
import { CognitivePanel } from "../cognitive-panel";
import { useCognitiveSettingsStore } from "../../store/cognitive-settings-store";

import Logo from "@/shared/ui/assets/logo.svg?react";

export function Sidebar() {
  const logoutUserUseCase = makeLogoutUserUseCase();

  const user = useAuthStore((state) => state.user);
  const resetCognitiveSettings = useCognitiveSettingsStore(
    (state) => state.reset,
  );

  const [openSettings, setOpenSettings] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logoutUserUseCase.execute();
    resetCognitiveSettings();
  }

  function handleOpenSettings() {
    setOpenSettings(true);
    setMobileOpen(false);
  }

  return (
    <>
      {/* MOBILE TOP BAR */}
      <button
        onClick={() => setMobileOpen(true)}
        className="absolute p-2 rounded-md hover:bg-muted"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-50
          top-0 left-0 h-screen
          w-70
          transform transition-transform duration-200
          bg-card border-r border-border
          flex flex-col gap-4 p-6
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        aria-label="Barra lateral de navegação"
      >
        {/* CLOSE BUTTON MOBILE */}
        <div className="flex justify-between items-center md:hidden">
          <span className="font-semibold">Menu</span>

          <button onClick={() => setMobileOpen(false)} aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>

        {/* HEADER */}
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Logo className="h-6 w-6 text-primary" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-body font-bold text-high-contrast">
              MindEase Focus
            </h2>

            <span className="text-caption text-muted">{user?.fullName}</span>
          </div>
        </header>

        <Separator />

        {/* NAV */}
        <nav className="flex flex-1 flex-col gap-2">
          <SidebarItem to="/" icon={Home} label="Início" />
          <SidebarItem to="/tasks" icon={CheckSquare} label="Tarefas" />

          <div className="mt-auto flex flex-col gap-2">
            <Separator />

            <BaseButton
              className="flex items-center gap-3 rounded-md justify-start text-muted hover:opacity-80 cursor-pointer"
              variant="ghost"
              onClick={handleOpenSettings}
            >
              <Settings className="h-5 w-5" />
              Configurações
            </BaseButton>

            <BaseButton
              className="flex items-center gap-3 rounded-md justify-start text-red-400 hover:bg-red-400/10 cursor-pointer hover:text-red-400"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Sair
            </BaseButton>
          </div>
        </nav>
      </aside>

      <CognitivePanel open={openSettings} onOpenChange={setOpenSettings} />
    </>
  );
}
