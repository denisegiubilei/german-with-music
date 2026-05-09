"use client";

import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="py-4 border-top">
      <Container className="px-3 px-md-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between gap-3 text-body-secondary small">
          <span>
            {t("footer.copyright", { year, brand: t("brand") })}
          </span>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            <a
              href="#"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              {t("footer.about")}
            </a>
            <a
              href="#"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              {t("footer.contact")}
            </a>
            <a
              href="#"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              {t("footer.privacy")}
            </a>
          </div>
        </div>
      </Container>
      <div className="german-flag-bar mt-4" />
    </footer>
  );
}
