"use client";

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
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./Header.module.scss";

export function HeaderInteractive({ copy }: { copy: HeaderCopy }) {
  return (
    <header
      className={`border-bottom bg-body position-fixed top-0 start-0 end-0 ${styles.header}`}
    >
      <div className="german-flag-bar" />
      <Navbar expand="md" className={`py-0 ${styles.navbar}`}>
        <Container fluid className="px-3 px-md-4">
          <NavbarBrand
            as={LocalizedLinkClient}
            href="/"
            className="d-flex align-items-center gap-2 fw-semibold me-auto mb-0"
          >
            <Music
              className="text-german-gold flex-shrink-0"
              size={20}
              aria-hidden
            />
            <span className="tracking-tight">{copy.brand}</span>
          </NavbarBrand>
          <NavbarToggle aria-controls="main-nav" className="border-0" />
          <NavbarCollapse id="main-nav" className="justify-content-end">
            <div className="d-flex flex-column flex-md-row align-items-center gap-3 gap-md-4 my-3 my-md-0">
              <Nav className="align-items-md-center gap-md-4 flex-md-row flex-column">
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
              <div className="d-flex align-items-center gap-3 ms-md-auto">
                <LanguageSwitcher languageAriaLabel={copy.languageAriaLabel} />
                <Button variant="warning" size="sm" className="text-dark border-0">
                  {copy.navStart}
                </Button>
              </div>
            </div>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
}
