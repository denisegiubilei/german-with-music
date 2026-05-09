"use client";

import classNames from "classnames";
import { Music } from "lucide-react";
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
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./Header.module.scss";

export function HeaderInteractive({ copy }: { copy: HeaderCopy }) {
  return (
    <header
      className={classNames(
        "border-bottom bg-body position-fixed top-0 start-0 end-0",
        styles.header,
      )}
    >
      <div className="german-flag-bar" />
      <Navbar expand="md" className={classNames("py-0", styles.navbar)}>
        <Container fluid className={classNames("px-3 px-md-4", styles.navbarInner)}>
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
                "align-items-md-center gap-md-4 flex-md-row flex-column my-3 my-md-0",
                styles.navDesktop,
              )}
            >
              <Nav.Link
                href={`#${SECTION_IDS.songs}`}
                className="text-body-secondary py-1"
              >
                {copy.navSongs}
              </Nav.Link>
              <Nav.Link
                href={`#${SECTION_IDS.howItWorks}`}
                className="text-body-secondary py-1"
              >
                {copy.navHowItWorks}
              </Nav.Link>
              <Nav.Link
                href={`#${SECTION_IDS.lyrics}`}
                className="text-body-secondary py-1"
              >
                {copy.navLyrics}
              </Nav.Link>
            </Nav>
            <div
              className={classNames(
                "d-flex align-items-center gap-3 my-3 my-md-0",
                styles.actionsDesktop,
              )}
            >
              <ThemeSwitcher
                ariaLabel={copy.themeAriaLabel}
                labelLight={copy.themeLight}
                labelDark={copy.themeDark}
              />
              <LanguageSwitcher languageAriaLabel={copy.languageAriaLabel} />
              <Button variant="warning" size="sm" className="text-dark border-0">
                {copy.navStart}
              </Button>
            </div>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
}
