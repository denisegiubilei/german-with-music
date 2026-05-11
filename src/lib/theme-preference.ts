export const THEME_STORAGE_KEY = "gwm-theme";

/** `null` = default light theme. Only `light` and `dark` are persisted. */
export type StoredThemePreference = "light" | "dark" | null;

export function readStoredThemePreference(): StoredThemePreference {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(THEME_STORAGE_KEY);
  if (raw === "light" || raw === "dark") return raw;
  if (raw === "system") {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function resolveBootstrapColorMode(
  stored: StoredThemePreference,
): "light" | "dark" {
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

export function applyThemePreference(stored: StoredThemePreference): void {
  document.documentElement.setAttribute(
    "data-bs-theme",
    resolveBootstrapColorMode(stored),
  );
}

const THEME_CHANGED_EVENT = "gwm-theme-preference";

export function notifyThemePreferenceChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
}

export function subscribeThemePreference(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(THEME_CHANGED_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(THEME_CHANGED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

/** Runs before paint; keep in sync with `readStoredThemePreference` / `resolveBootstrapColorMode`. */
export const THEME_BOOT_INLINE_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var p=localStorage.getItem(k);var r=p==="light"||p==="dark"?p:"light";document.documentElement.setAttribute("data-bs-theme",r);}catch(e){}})();`;
