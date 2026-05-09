"use client";

import classNames from "classnames";
import { ArrowRight } from "lucide-react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Trans, useTranslation } from "react-i18next";
import { SECTION_IDS } from "@/lib/section-ids";
import styles from "./HeroSection.module.scss";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className={classNames(
        "d-flex align-items-center justify-content-center",
        styles.section,
      )}
    >
      <Container className="px-3 px-md-4">
        <div className={classNames("mx-auto text-center", styles.inner)}>
          <p className="small fw-medium text-german-red mb-3 animate-fade-in">
            {t("hero.eyebrow")}
          </p>

          <h1
            className={classNames(
              "display-4 fw-bold mb-4 animate-fade-in",
              styles.tagline,
            )}
          >
            <Trans
              i18nKey="hero.title"
              components={{
                1: <span className="text-german-gold" />,
              }}
            />
          </h1>

          <p
            className={classNames(
              "lead text-body-secondary mb-4 animate-fade-in",
              styles.lead,
            )}
          >
            {t("hero.lead")}
          </p>

          <div
            className={classNames(
              "d-flex flex-column flex-sm-row gap-2 justify-content-center align-items-stretch align-items-sm-center animate-fade-in mb-5",
              styles.actions,
            )}
          >
            <Button
              variant="dark"
              size="lg"
              className="d-inline-flex align-items-center justify-content-center"
              href={`#${SECTION_IDS.songs}`}
            >
              {t("hero.exploreSongs")}
              <ArrowRight className="ms-2" size={16} aria-hidden />
            </Button>
            <Button variant="outline-secondary" size="lg" href={`#${SECTION_IDS.lyrics}`}>
              {t("hero.viewLyrics")}
            </Button>
          </div>

          <div
            className={classNames(
              "d-flex flex-wrap align-items-center justify-content-center gap-4 gap-md-5 animate-fade-in",
              styles.stats,
            )}
          >
            <div className="text-center">
              <div className="fs-3 fw-bold text-german-gold">
                {t("hero.statSongsValue")}
              </div>
              <div
                className={classNames(
                  "small text-body-secondary text-uppercase",
                  styles.statLabel,
                )}
              >
                {t("hero.statSongsLabel")}
              </div>
            </div>
            <div
              className={classNames(
                "vr d-none d-sm-block opacity-25",
                styles.divider,
              )}
            />
            <div className="text-center">
              <div className="fs-3 fw-bold text-german-red">
                {t("hero.statTranslatedValue")}
              </div>
              <div
                className={classNames(
                  "small text-body-secondary text-uppercase",
                  styles.statLabel,
                )}
              >
                {t("hero.statTranslatedLabel")}
              </div>
            </div>
            <div
              className={classNames(
                "vr d-none d-sm-block opacity-25",
                styles.divider,
              )}
            />
            <div className="text-center">
              <div className="fs-3 fw-bold">{t("hero.statFreeValue")}</div>
              <div
                className={classNames(
                  "small text-body-secondary text-uppercase",
                  styles.statLabel,
                )}
              >
                {t("hero.statFreeLabel")}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
