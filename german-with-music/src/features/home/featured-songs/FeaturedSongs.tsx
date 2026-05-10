"use client";

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { SongCard } from "@/components/song-card/SongCard";
import type { YoutubeReleasesListResponse } from "@/entities/youtube-release";
import { SECTION_IDS } from "@/lib/section-ids";
import {
  youtubeWatchUrlToEmbedUrl,
  youtubeWatchUrlToThumbnailUrl,
} from "@/shared/lib/youtube";
import styles from "./FeaturedSongs.module.scss";

export function FeaturedSongs({
  releasesPayload,
}: {
  releasesPayload: YoutubeReleasesListResponse | null;
}) {
  const { t } = useTranslation();
  const items = releasesPayload?.data ?? [];
  const fetchFailed = releasesPayload === null;

  return (
    <section id={SECTION_IDS.songs} className="py-5 bg-body-secondary">
      <Container className="px-3 px-md-4">
        <div className="text-center mb-5">
          <h2 className={classNames("h1 fw-bold mb-3", styles.title)}>
            {t("featuredSongs.title")}
          </h2>
          <p
            className={classNames(
              "text-body-secondary mx-auto mb-0",
              styles.subtitle,
            )}
          >
            {t("featuredSongs.subtitle")}
          </p>
        </div>

        {fetchFailed ? (
          <Alert variant="danger" className="mb-0">
            {t("featuredSongs.error")}
          </Alert>
        ) : items.length === 0 ? (
          <p className="text-body-secondary text-center mb-0">
            {t("featuredSongs.empty")}
          </p>
        ) : (
          <Row className="g-3 g-md-4">
            {items.map((release, index) => (
              <Col key={release.id} xs={12} sm={6} lg={3}>
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SongCard
                    title={release.title}
                    artist={release.artist}
                    thumbnailSrc={youtubeWatchUrlToThumbnailUrl(release.url)}
                    embedUrl={youtubeWatchUrlToEmbedUrl(release.url)}
                    watchUrl={release.url}
                    detailHref={`/song/${release.id}`}
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
}
