import styles from "./SongCard.module.scss";

export interface SongCardProps {
  title: string;
  artist: string | null;
  /** Full `https://www.youtube.com/embed/…` URL, or null if the source URL could not be parsed. */
  embedUrl: string | null;
  watchUrl?: string;
}

export function SongCard({ title, artist, embedUrl, watchUrl }: SongCardProps) {
  const displayArtist = artist?.trim() ? artist : "—";

  return (
    <article className="song-card">
      <div className={`song-card__media mb-2 ${styles.media}`}>
        {embedUrl ? (
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
      <h3 className="fw-medium small text-truncate mb-0">{title}</h3>
      <p className="text-body-secondary text-truncate small mb-0">
        {displayArtist}
      </p>
    </article>
  );
}
