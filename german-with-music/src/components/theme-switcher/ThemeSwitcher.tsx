"use client";

import classNames from "classnames";
import { forwardRef, useCallback, useEffect, useSyncExternalStore } from "react";
import { Dropdown } from "react-bootstrap";
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

type ToggleProps = React.ComponentPropsWithoutRef<"button">;

const ThemeToggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function ThemeToggle({ children, className = "", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        {...rest}
        className={classNames(styles.toggle, className)}
      >
        {children}
      </button>
    );
  },
);

function themeIcon(resolved: "light" | "dark") {
  return resolved === "dark" ? (
    <Moon size={18} aria-hidden />
  ) : (
    <Sun size={18} aria-hidden />
  );
}

export function ThemeSwitcher({
  ariaLabel,
  labelLight,
  labelDark,
}: {
  ariaLabel: string;
  labelLight: string;
  labelDark: string;
}) {
  const stored = useSyncExternalStore(
    subscribeThemePreference,
    readStoredThemePreference,
    (): StoredThemePreference => null,
  );

  const resolved = resolveBootstrapColorMode(stored);

  useEffect(() => {
    applyThemePreference(stored);
  }, [stored]);

  const handleSelect = useCallback((code: string | null) => {
    if (code !== "light" && code !== "dark") return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, code);
    } catch {
      /* private mode / quota */
    }
    applyThemePreference(code);
    notifyThemePreferenceChanged();
  }, []);

  const lightActive = stored === "light" || stored === null;
  const darkActive = stored === "dark";

  return (
    <Dropdown align="end" onSelect={handleSelect}>
      <Dropdown.Toggle
        as={ThemeToggle}
        id="theme-switcher-toggle"
        aria-label={ariaLabel}
      >
        {themeIcon(resolved)}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="light" active={lightActive}>
          {labelLight}
        </Dropdown.Item>
        <Dropdown.Item eventKey="dark" active={darkActive}>
          {labelDark}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
