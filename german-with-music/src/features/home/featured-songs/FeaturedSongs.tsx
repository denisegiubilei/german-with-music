"use client";

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { SongCard } from "@/components/song-card/SongCard";
import { SECTION_IDS } from "@/lib/section-ids";
import { useGetYoutubeReleasesQuery } from "@/shared/api/lyric-palette";
import { youtubeWatchUrlToEmbedUrl } from "@/shared/lib/youtube";
import styles from "./FeaturedSongs.module.scss";

const FEATURED_LIMIT = 4;

export function FeaturedSongs() {
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useGetYoutubeReleasesQuery({
    featured: true,
    page: 1,
    pageSize: FEATURED_LIMIT,
  });

  const items = data?.data ?? [];

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

        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" role="status" aria-label={t("featuredSongs.loading")} />
          </div>
        ) : isError ? (
          <Alert variant="danger" className="mb-0">
            {t("featuredSongs.error")}
            {process.env.NODE_ENV === "development" && error && "message" in error ? (
              <span className="d-block small mt-1">
                {(error as { message?: string }).message}
              </span>
            ) : null}
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
                    embedUrl={youtubeWatchUrlToEmbedUrl(release.url)}
                    watchUrl={release.url}
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
