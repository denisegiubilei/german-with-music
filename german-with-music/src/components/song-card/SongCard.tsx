import { Play } from "lucide-react";
import type { Song } from "@/types/song";

export function SongCard({ title, artist, imageUrl }: Song) {
  return (
    <article className="song-card">
      <div className="song-card__media mb-2">
        <img src={imageUrl} alt={title} className="song-card__img" />
        <div className="song-card__overlay" aria-hidden>
          <div className="song-card__play bg-german-gold">
            <Play
              className="text-dark ms-1"
              size={16}
              fill="currentColor"
              aria-hidden
            />
          </div>
        </div>
      </div>
      <h3 className="fw-medium small text-truncate mb-0">{title}</h3>
      <p className="text-body-secondary text-truncate small mb-0">{artist}</p>
    </article>
  );
}
