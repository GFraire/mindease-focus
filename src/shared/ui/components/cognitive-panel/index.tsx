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
      <SheetContent
        side="right"
        className="min-w-95 sm:min-w-105 p-6"
        aria-labelledby="cognitive-panel-title"
        aria-describedby="cognitive-panel-description"
      >
        <SheetHeader className="p-0">
          <SheetTitle
            id="cognitive-panel-title"
            className="text-heading text-high-contrast font-bold"
          >
            Painel de controle cognitivo
          </SheetTitle>

          <SheetDescription
            id="cognitive-panel-description"
            className="text-body-sm text-muted"
          >
            Personalize sua experiência para reduzir o esforço mental.
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className="space-y-8">
          {/* Nível de energia */}
          <section className="space-y-2" aria-labelledby="energy-title">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" aria-hidden="true" />

              <h3
                id="energy-title"
                className="text-body-lg text-high-contrast font-bold"
              >
                Nível de energia
              </h3>
            </div>

            <p className="text-body-sm text-muted">
              Como você se sente agora? Ajuste conforme sua disposição.
            </p>

            <div
              role="radiogroup"
              aria-label="Selecione seu nível de energia"
              className="flex gap-2"
            >
              <SelectButton
                role="radio"
                aria-checked={energy === "low"}
                selected={energy === "low"}
                onClick={() => setEnergy("low")}
              >
                Baixa
              </SelectButton>

              <SelectButton
                role="radio"
                aria-checked={energy === "medium"}
                selected={energy === "medium"}
                onClick={() => setEnergy("medium")}
              >
                Média
              </SelectButton>

              <SelectButton
                role="radio"
                aria-checked={energy === "high"}
                selected={energy === "high"}
                onClick={() => setEnergy("high")}
              >
                Alta
              </SelectButton>
            </div>
          </section>

          {/* Ajustes visuais */}
          <section className="space-y-4" aria-labelledby="visual-title">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" aria-hidden="true" />

              <h3
                id="visual-title"
                className="text-body-lg font-bold text-high-contrast"
              >
                Ajustes visuais
              </h3>
            </div>

            <div className="space-y-2">
              <p
                id="font-size-label"
                className="text-body font-semibold text-high-contrast"
              >
                Tamanho da fonte
              </p>

              <div
                role="radiogroup"
                aria-labelledby="font-size-label"
                className="flex gap-2"
              >
                <SelectButton
                  role="radio"
                  aria-checked={fontSize === "normal"}
                  selected={fontSize === "normal"}
                  onClick={() => setFontSize("normal")}
                >
                  Normal
                </SelectButton>

                <SelectButton
                  role="radio"
                  aria-checked={fontSize === "large"}
                  selected={fontSize === "large"}
                  onClick={() => setFontSize("large")}
                >
                  Grande
                </SelectButton>

                <SelectButton
                  role="radio"
                  aria-checked={fontSize === "extra"}
                  selected={fontSize === "extra"}
                  onClick={() => setFontSize("extra")}
                >
                  Extra
                </SelectButton>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p
                  id="dark-mode-label"
                  className="text-body font-semibold text-high-contrast"
                >
                  Tema escuro
                </p>

                <p className="text-muted text-body-sm">
                  Altere entre tema claro ou escuro.
                </p>
              </div>

              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                aria-labelledby="dark-mode-label"
                className="data-[state=unchecked]:bg-muted-light data-[state=unchecked]:border data-[state=unchecked]:border-border"
              />
            </div>
          </section>

          {/* Estímulos sensoriais */}
          <section className="space-y-4" aria-labelledby="stimulus-title">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />

              <h3
                id="stimulus-title"
                className="text-body-lg font-bold text-high-contrast"
              >
                Estímulos sensoriais
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p
                  id="reduce-animations-label"
                  className="text-high-contrast font-semibold text-body"
                >
                  Reduzir animações
                </p>

                <p className="text-body-sm text-muted">
                  Evita distrações em movimento.
                </p>
              </div>

              <Switch
                checked={reduceAnimations}
                onCheckedChange={toggleReduceAnimations}
                aria-labelledby="reduce-animations-label"
                className="data-[state=unchecked]:bg-muted-light data-[state=unchecked]:border data-[state=unchecked]:border-border"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p
                  id="mute-notifications-label"
                  className="text-high-contrast font-semibold text-body"
                >
                  Silenciar notificações
                </p>

                <p className="text-body-sm text-muted">
                  Evita sons durante o modo foco.
                </p>
              </div>

              <Switch
                checked={muteNotifications}
                onCheckedChange={toggleMuteNotifications}
                aria-labelledby="mute-notifications-label"
                className="data-[state=unchecked]:bg-muted-light data-[state=unchecked]:border data-[state=unchecked]:border-border"
              />
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
