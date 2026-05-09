"use client";

import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SongCard } from "@/components/song-card/SongCard";
import { SECTION_IDS } from "@/lib/section-ids";
import type { Song } from "@/types/song";
import styles from "./FeaturedSongs.module.scss";

export function FeaturedSongs() {
  const { t } = useTranslation();
  const items = t("featuredSongs.items", { returnObjects: true }) as Song[];

  return (
    <section id={SECTION_IDS.songs} className="py-5 bg-body-secondary">
      <Container className="px-3 px-md-4">
        <div className="text-center mb-5">
          <h2 className={`h1 fw-bold mb-3 ${styles.title}`}>
            {t("featuredSongs.title")}
          </h2>
          <p
            className={`text-body-secondary mx-auto mb-0 ${styles.subtitle}`}
          >
            {t("featuredSongs.subtitle")}
          </p>
        </div>

        <Row className="g-3 g-md-4">
          {items.map((song, index) => (
            <Col key={song.title} xs={6} lg={3}>
              <div
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SongCard {...song} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
