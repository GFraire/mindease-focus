import { Zap, Palette, Sparkles } from "lucide-react";
import { Switch } from "@/shared/ui/components/ui/switch";
import { Separator } from "@/shared/ui/components/ui/separator";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/ui/components/ui/sheet";
import { useCognitiveSettingsStore } from "../../store/cognitive-settings-store";
import { SelectButton } from "../form/select-button";

interface CognitivePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CognitivePanel({ open, onOpenChange }: CognitivePanelProps) {
  const {
    energy,
    setEnergy,
    fontSize,
    setFontSize,
    darkMode,
    toggleDarkMode,
    reduceAnimations,
    toggleReduceAnimations,
    muteNotifications,
    toggleMuteNotifications,
  } = useCognitiveSettingsStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="min-w-95 sm:min-w-105 p-6">
        <SheetHeader className="p-0">
          <SheetTitle className="text-heading text-high-contrast font-bold">
            Painel de controle cognitivo
          </SheetTitle>

          <SheetDescription className="text-body-sm text-muted">
            Personalize sua experiência para reduzir o esforço mental.
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="space-y-8">
          {/* Nível de energia */}
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-body-lg text-high-contrast font-bold">
                Nível de energia
              </h3>
            </div>

            <p className="text-body-sm text-muted">
              Como você se sente agora? Ajuste conforme sua disposição.
            </p>

            <div className="flex gap-2">
              <SelectButton
                selected={energy === "low"}
                onClick={() => setEnergy("low")}
              >
                Baixa
              </SelectButton>

              <SelectButton
                selected={energy === "medium"}
                onClick={() => setEnergy("medium")}
              >
                Média
              </SelectButton>

              <SelectButton
                selected={energy === "high"}
                onClick={() => setEnergy("high")}
              >
                Alta
              </SelectButton>
            </div>
          </section>

          {/* Ajustes visuais */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="text-body-lg font-bold text-high-contrast">
                Ajustes Visuais
              </h3>
            </div>

            <div className="space-y-2">
              <p className="text-body font-semibold text-high-contrast">
                Tamanho da fonte
              </p>

              <div className="flex gap-2">
                <SelectButton
                  selected={fontSize === "normal"}
                  onClick={() => setFontSize("normal")}
                >
                  Normal
                </SelectButton>

                <SelectButton
                  selected={fontSize === "large"}
                  onClick={() => setFontSize("large")}
                >
                  Grande
                </SelectButton>

                <SelectButton
                  selected={fontSize === "extra"}
                  onClick={() => setFontSize("extra")}
                >
                  Extra
                </SelectButton>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-body font-semibold text-high-contrast">
                  Tema escuro
                </p>

                <p className="text-muted text-body-sm">
                  Altere entre tema claro ou escuro.
                </p>
              </div>

              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=unchecked]:bg-muted-light data-[state=unchecked]:border data-[state=unchecked]:border-border"
              />
            </div>
          </section>

          {/* Estímulos sensoriais */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />

              <h3 className="text-body-lg font-bold text-high-contrast">
                Estímulos sensoriais
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-high-contrast font-semibold text-body">
                  Reduzir animações
                </p>

                <p className="text-body-sm text-muted">
                  Evita distrações em movimento.
                </p>
              </div>

              <Switch
                checked={reduceAnimations}
                onCheckedChange={toggleReduceAnimations}
                className="data-[state=unchecked]:bg-muted-light data-[state=unchecked]:border data-[state=unchecked]:border-border"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-high-contrast font-semibold text-body">
                  Silenciar notificações
                </p>

                <p className="text-body-sm text-muted">
                  Evita sons durante o modo foco.
                </p>
              </div>

              <Switch
                checked={muteNotifications}
                onCheckedChange={toggleMuteNotifications}
                className="data-[state=unchecked]:bg-muted-light data-[state=unchecked]:border data-[state=unchecked]:border-border"
              />
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
