import Image from "next/image";
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
  /** App path without locale prefix, e.g. `/song/uuid`. */
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
  const displayArtist = artist?.trim() ? artist : "—";
  const thumbAlt = `${title} — ${displayArtist}`;

  const titleBlock = (
    <>
      <h3 className="fw-medium small text-truncate mb-0">{title}</h3>
      <p className="text-body-secondary text-truncate small mb-0">
        {displayArtist}
      </p>
    </>
  );

  return (
    <article className="song-card">
      <div className={`song-card__media mb-2 ${styles.media}`}>
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={thumbAlt}
            fill
            className={styles.thumbnail}
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
            loading="lazy"
          />
        ) : embedUrl ? (
          <iframe
            className={styles.iframe}
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className={`text-body-secondary ${styles.fallback}`}>
            {watchUrl ? (
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
      {detailHref ? (
        <LocalizedLinkClient
          href={detailHref}
          className="d-block text-decoration-none text-reset"
        >
          {titleBlock}
        </LocalizedLinkClient>
      ) : (
        titleBlock
      )}
    </article>
  );
}
