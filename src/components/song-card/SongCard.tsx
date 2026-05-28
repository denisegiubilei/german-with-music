"use client";

import classNames from "classnames";
import { Music2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";
import styles from "./SongCard.module.scss";

export interface SongCardProps {
  title: string;
  artist: string | null;
  /**
   * When set (e.g. on the library page), shows this image instead of an embed iframe.
   * Must be an allowed `next/image` remote URL (e.g. `img.youtube.com`).
   */
  thumbnailSrc?: string | null;
  /** Full `https://www.youtube.com/embed/…` URL, or null if the source URL could not be parsed. */
  embedUrl: string | null;
  watchUrl?: string;
  /** App path without locale prefix, e.g. `/song/artist-title-slug`. */
  detailHref?: string;
}

export function SongCard({
  title,
  artist,
  thumbnailSrc,
  embedUrl,
  watchUrl,
  detailHref,
}: SongCardProps) {
  const { t } = useTranslation();
  const [failedThumbnailSrc, setFailedThumbnailSrc] = useState<string | null>(
    null,
  );

  const displayArtist = artist?.trim() ? artist : "—";
  const thumbAlt = `${title} — ${displayArtist}`;
  const trimmedThumb = thumbnailSrc?.trim() ?? "";
  const hasThumbnailUrl = trimmedThumb.length > 0;
  const thumbnailFailed =
    hasThumbnailUrl && failedThumbnailSrc === trimmedThumb;
  const showImage = hasThumbnailUrl && !thumbnailFailed;
  const showEmbed = Boolean(embedUrl) && !hasThumbnailUrl;

  return (
    <article
      className={classNames(styles.card, detailHref && styles.cardInteractive)}
    >
      <div className={styles.media}>
        {showImage ? (
          <Image
            src={trimmedThumb}
            alt={thumbAlt}
            fill
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
            className={styles.thumbnail}
            loading="lazy"
            onError={() => setFailedThumbnailSrc(trimmedThumb)}
          />
        ) : showEmbed ? (
          <iframe
            className={styles.iframe}
            src={embedUrl!}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : hasThumbnailUrl && thumbnailFailed ? (
          <div
            className={styles.mediaFallback}
            role="img"
            aria-label={t("songCard.noThumbnailAria")}
          >
            <Music2 className={styles.mediaFallbackIcon} aria-hidden strokeWidth={1.5} />
          </div>
        ) : (
          <div className={classNames("text-body-secondary", styles.fallback)}>
            {watchUrl && !detailHref ? (
              <a
                className={styles.fallbackLink}
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            ) : (
              <span>{title}</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.textBlock}>
        <h3 className={styles.title}>{title}</h3>
        <p className={classNames(styles.artist, "text-body-secondary")}>
          {displayArtist}
        </p>
      </div>

      {detailHref ? (
        <LocalizedLinkClient
          href={detailHref}
          className={styles.overlayLink}
          aria-label={t("songCard.openDetailsAria", {
            title,
            artist: displayArtist,
          })}
        />
      ) : null}
    </article>
  );
}
