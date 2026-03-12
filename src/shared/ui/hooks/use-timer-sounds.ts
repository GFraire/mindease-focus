import { useEffect, useRef } from "react";

export function useTimerSounds() {
  const focusEndSound = useRef<HTMLAudioElement | null>(null);
  const breakEndSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    focusEndSound.current = new Audio("/sounds/focus-end.mp3");
    breakEndSound.current = new Audio("/sounds/break-end.mp3");

    focusEndSound.current.volume = 0.4;
    breakEndSound.current.volume = 0.4;

    focusEndSound.current.load();
    breakEndSound.current.load();
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  function playFocusEnd(muteNotification: boolean) {
    if (!muteNotification) {
      vibrate();
      notify("Hora do intervalo", "Faça uma pausa.");
    }

    focusEndSound.current?.play().catch(() => {});
  }

  function playBreakEnd(muteNotification: boolean) {
    if (!muteNotification) {
      vibrate();
      notify("Hora de focar", "Inicie outro ciclo e mantenha-se focado.");
    }

    breakEndSound.current?.play().catch(() => {});
  }

  function vibrate() {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  function notify(title: string, body: string) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }

  return {
    playFocusEnd,
    playBreakEnd,
  };
}
