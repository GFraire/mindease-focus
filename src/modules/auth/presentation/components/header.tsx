import Logo from "@/shared/ui/assets/logo.svg?react";

export function HeaderLogin() {
  return (
    <div className="w-full bg-card px-8 py-6 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <Logo className="w-8 h-8 text-primary" />

        <span className="text-high-contrast text-heading font-bold">MindEase Focus</span>
      </div>

      <span className="text-muted text-body-sm">Design minimalista para sua mente</span>
    </div>
  );
}
