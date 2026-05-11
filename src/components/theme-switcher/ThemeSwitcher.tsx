"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  type StoredThemePreference,
  applyThemePreference,
  notifyThemePreferenceChanged,
  readStoredThemePreference,
  resolveBootstrapColorMode,
  subscribeThemePreference,
  THEME_STORAGE_KEY,
} from "@/lib/theme-preference";
import styles from "./ThemeSwitcher.module.scss";

function themeIcon(resolved: "light" | "dark") {
  return resolved === "dark" ? (
    <Moon size={18} aria-hidden />
  ) : (
    <Sun size={18} aria-hidden />
  );
}

export function ThemeSwitcher({ ariaLabel }: { ariaLabel: string }) {
  const stored = useSyncExternalStore(
    subscribeThemePreference,
    readStoredThemePreference,
    (): StoredThemePreference => null,
  );

  const resolved = resolveBootstrapColorMode(stored);

  useEffect(() => {
    applyThemePreference(stored);
  }, [stored]);

  const handleClick = useCallback(() => {
    const next: StoredThemePreference = stored === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode / quota */
    }
    applyThemePreference(next);
    notifyThemePreferenceChanged();
  }, [stored]);

  return (
    <button
      type="button"
      id="theme-switcher-toggle"
      className={styles.toggle}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {themeIcon(resolved)}
    </button>
  );
}
