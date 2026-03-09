import { LogOut } from "lucide-react";
import { BaseButton } from "@/shared/ui/components/form/base-button";

interface ExitFocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExitFocusModal({
  isOpen,
  onClose,
  onConfirm,
}: ExitFocusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-105 rounded-xl bg-background p-8 flex flex-col items-center gap-6">
        <LogOut className="text-primary size-7" />

        <div className="text-center flex flex-col gap-2">
          <h2 className="text-heading font-semibold text-high-contrast">
            Deseja sair do foco?
          </h2>

          <p className="text-body text-muted">
            Se você sair agora, o progresso deste ciclo de foco não será salvo.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3">
          <BaseButton
            onClick={onClose}
            className="bg-primary text-card py-3 justify-center cursor-pointer"
          >
            <span className="text-body-lg text-white!">Continuar no foco</span>
          </BaseButton>

          <BaseButton
            onClick={onConfirm}
            variant="ghost"
            className="text-muted-light text-body font-medium cursor-pointer hover:underline"
          >
            <span className="text-body-lg text-muted-light ">
              Sim, sair agora
            </span>
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
