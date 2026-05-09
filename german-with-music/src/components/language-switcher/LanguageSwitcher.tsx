"use client";

import { forwardRef, useCallback } from "react";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { cookieName, localeDisplayNames, locales, type Locale } from "@/i18n/settings";
import { localizedPath, pathWithoutLocale } from "@/lib/localized-path";
import styles from "./LanguageSwitcher.module.scss";

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const LanguageToggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function LanguageToggle({ children, className = "", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        {...rest}
        className={`${styles.toggle} ${className}`.trim()}
      >
        {children}
      </button>
    );
  },
);

export function LanguageSwitcher({
  languageAriaLabel,
}: {
  languageAriaLabel: string;
}) {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const current = (i18n.resolvedLanguage ?? i18n.language) as Locale;

  const handleSelect = useCallback(
    (code: string | null) => {
      if (!code || code === current) return;
      const next = code as Locale;
      const base = pathWithoutLocale(pathname);
      const href = localizedPath(base, next);
      document.cookie = `${cookieName}=${encodeURIComponent(next)};path=/;max-age=31536000;SameSite=Lax`;
      void i18n.changeLanguage(next);
      router.push(href);
    },
    [current, i18n, pathname, router],
  );

  return (
    <Dropdown align="end" onSelect={handleSelect}>
      <Dropdown.Toggle
        as={LanguageToggle}
        id="language-switcher-toggle"
        aria-label={languageAriaLabel}
      >
        <Globe size={18} aria-hidden />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {locales.map((code) => (
          <Dropdown.Item
            key={code}
            eventKey={code}
            active={current === code}
          >
            {localeDisplayNames[code]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
