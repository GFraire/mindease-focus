import Logo from "@/shared/ui/assets/logo.svg?react";

export function HeaderLogin() {
  return (
    <header className="w-full bg-card px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />

        <span className="text-high-contrast text-sm sm:text-heading font-bold">
          MindEase Focus
        </span>
      </div>

      <span className="hidden sm:block text-muted text-body-sm">
        Design minimalista para sua mente
      </span>
    </header>
  );
}
