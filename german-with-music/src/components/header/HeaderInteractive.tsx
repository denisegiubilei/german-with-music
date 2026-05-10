"use client";

import classNames from "classnames";
import { Music } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  Container,
  Nav,
  Button,
} from "react-bootstrap";
import type { HeaderCopy } from "@/components/header/header-copy";
import { LanguageSwitcher } from "@/components/language-switcher/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/theme-switcher/ThemeSwitcher";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";
import { pathWithoutLocale } from "@/lib/localized-path";
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./Header.module.scss";

export function HeaderInteractive({ copy }: { copy: HeaderCopy }) {
  const pathname = usePathname();
  const isHome = pathWithoutLocale(pathname) === "/";
  const sectionNavClass = classNames(
    "text-body-secondary py-md-1",
    styles.mobileNavLink,
  );

  return (
    <header
      className={classNames(
        "border-bottom bg-body position-fixed top-0 start-0 end-0",
        styles.header,
      )}
    >
      <div className="german-flag-bar" />
      <Navbar expand="md" className={classNames(styles.navbar)}>
        <Container
          fluid
          className={classNames("px-3 px-md-4", styles.navbarInner)}
        >
          <NavbarBrand
            as={LocalizedLinkClient}
            href="/"
            className={classNames(
              "d-flex align-items-center gap-2 fw-semibold mb-0",
              styles.brandDesktop,
            )}
          >
            <Music
              className="text-german-gold flex-shrink-0"
              size={20}
              aria-hidden
            />
            <span className="tracking-tight">{copy.brand}</span>
          </NavbarBrand>
          <NavbarToggle aria-controls="main-nav" className="border-0" />
          <NavbarCollapse id="main-nav" className={styles.collapseDesktop}>
            <Nav
              className={classNames(
                "flex-column flex-md-row mb-0",
                "gap-0 gap-md-4",
                "align-items-stretch align-items-md-center",
                "w-100 my-md-0",
                styles.navDesktop,
                styles.mobileNav,
              )}
            >
              {isHome ? (
                <Nav.Link href={`#${SECTION_IDS.songs}`} className={sectionNavClass}>
                  {copy.navSongs}
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={LocalizedLinkClient}
                  href={`/#${SECTION_IDS.songs}`}
                  className={sectionNavClass}
                >
                  {copy.navSongs}
                </Nav.Link>
              )}
              <Nav.Link
                as={LocalizedLinkClient}
                href="/library"
                className={classNames(
                  "text-body-secondary py-md-1",
                  styles.mobileNavLink,
                )}
              >
                {copy.navLibrary}
              </Nav.Link>
              {isHome ? (
                <Nav.Link
                  href={`#${SECTION_IDS.howItWorks}`}
                  className={sectionNavClass}
                >
                  {copy.navHowItWorks}
                </Nav.Link>
              ) : (
                <Nav.Link
                  as={LocalizedLinkClient}
                  href={`/#${SECTION_IDS.howItWorks}`}
                  className={sectionNavClass}
                >
                  {copy.navHowItWorks}
                </Nav.Link>
              )}
            </Nav>
            <div
              className={classNames(
                "d-flex flex-column flex-md-row",
                "align-items-stretch align-items-md-center",
                "gap-md-3 my-md-0",
                styles.actionsDesktop,
                styles.mobileActions,
              )}
            >
              <div className={styles.mobileToolbarWrap}>
                <ThemeSwitcher
                  ariaLabel={copy.themeAriaLabel}
                  labelLight={copy.themeLight}
                  labelDark={copy.themeDark}
                />
                <LanguageSwitcher languageAriaLabel={copy.languageAriaLabel} />
              </div>
              <Button
                variant="warning"
                size="sm"
                className={classNames(
                  "text-dark border-0",
                  "w-100 w-md-auto",
                  "py-2 py-md-1",
                )}
              >
                {copy.navStart}
              </Button>
            </div>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
}
