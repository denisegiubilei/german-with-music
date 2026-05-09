"use client";

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import Container from "react-bootstrap/Container";
import { LyricsDisplay } from "@/components/lyrics-display/LyricsDisplay";
import { SECTION_IDS } from "@/lib/section-ids";
import type { LyricLine } from "@/types/lyrics";
import styles from "./LyricsSection.module.scss";

export function LyricsSection() {
  const { t } = useTranslation();
  const lines = t("lyrics.example.lines", {
    returnObjects: true,
  }) as LyricLine[];

  return (
    <section id={SECTION_IDS.lyrics} className="py-5 bg-body-secondary">
      <Container className="px-3 px-md-4">
        <div className={classNames("mx-auto", styles.container)}>
          <div className="text-center mb-4">
            <p
              className={classNames(
                "small fw-medium text-german-red text-uppercase mb-2",
                styles.kicker,
              )}
            >
              {t("lyrics.example.kicker")}
            </p>
            <h2 className={classNames("h1 fw-bold mb-1", styles.title)}>
              {t("lyrics.example.title")}
            </h2>
            <p className="small text-body-secondary mb-0">
              {t("lyrics.example.meta")}
            </p>
          </div>

          <Card className="border shadow-sm">
            <CardBody className="p-4">
              <LyricsDisplay lyrics={lines} />
            </CardBody>
          </Card>
        </div>
      </Container>
    </section>
  );
}
