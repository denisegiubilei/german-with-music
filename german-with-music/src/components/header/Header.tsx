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
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header
      className={`border-bottom bg-body position-fixed top-0 start-0 end-0 ${styles.header}`}
    >
      <div className="german-flag-bar" />
      <Navbar expand="md" className={`py-0 ${styles.navbar}`}>
        <Container fluid className="px-3 px-md-4">
          <NavbarBrand
            href="/"
            className="d-flex align-items-center gap-2 fw-semibold me-auto mb-0"
          >
            <Music
              className="text-german-gold flex-shrink-0"
              size={20}
              aria-hidden
            />
            <span className="tracking-tight">Alemão com Música</span>
          </NavbarBrand>
          <NavbarToggle aria-controls="main-nav" className="border-0" />
          <NavbarCollapse id="main-nav" className="justify-content-end">
            <Nav className="align-items-md-center gap-md-4 my-3 my-md-0">
              <Nav.Link
                href={`#${SECTION_IDS.songs}`}
                className="text-body-secondary py-1"
              >
                Músicas
              </Nav.Link>
              <Nav.Link
                href={`#${SECTION_IDS.howItWorks}`}
                className="text-body-secondary py-1"
              >
                Como Funciona
              </Nav.Link>
              <Nav.Link
                href={`#${SECTION_IDS.lyrics}`}
                className="text-body-secondary py-1"
              >
                Letras
              </Nav.Link>
            </Nav>
            <Button
              variant="warning"
              size="sm"
              className="ms-md-3 text-dark border-0"
            >
              Começar
            </Button>
          </NavbarCollapse>
        </Container>
      </Navbar>
    </header>
  );
}
