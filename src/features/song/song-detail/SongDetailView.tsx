import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { YoutubeRelease } from "@/entities/youtube-release";
import { getT } from "@/i18n/server";
import type { Locale } from "@/i18n/settings";
import { fetchReleaseVerses } from "@/integrations/lyric-palette/server";
import { localizedPath } from "@/lib/localized-path";
import { youtubeWatchUrlToEmbedUrl } from "@/shared/lib/youtube";
import { SongLearnTabs } from "./SongLearnTabs";
import styles from "./SongDetailView.module.scss";

export async function SongDetailView({
  release,
  locale,
  neighborPrevId,
  neighborNextId,
}: {
  release: YoutubeRelease;
  locale: Locale;
  neighborPrevId: string | null;
  neighborNextId: string | null;
}) {
  const { t } = await getT(locale);
  const libraryHref = localizedPath("/library", locale);
  const prevHref = neighborPrevId
    ? localizedPath(`/song/${neighborPrevId}`, locale)
    : libraryHref;
  const nextHref = neighborNextId
    ? localizedPath(`/song/${neighborNextId}`, locale)
    : libraryHref;
  const prevAria = neighborPrevId
    ? t("songPage.prevAria")
    : t("songPage.navToLibraryAria");
  const nextAria = neighborNextId
    ? t("songPage.nextAria")
    : t("songPage.navToLibraryAria");
  const embedUrl = youtubeWatchUrlToEmbedUrl(release.url);
  const artist = release.artist?.trim() ? release.artist : "—";
  const glossary = release.glossary?.trim()
    ? release.glossary
    : null;

  const versesPayload = await fetchReleaseVerses(release.id);
  const verseLines =
    versesPayload?.verses.map((v) => ({
      original: v.original.text,
      translation: v.translation.text,
    })) ?? [];

  const navBtnClass =
    "btn btn-primary d-inline-flex align-items-center gap-1";

  return (
    <div className="py-4 py-md-5">
      <Container className="px-3 px-md-4">
        <div className={classNames(styles.titleNav, "mb-4 mb-md-5")}>
          <div className={styles.titleNavSide}>
            <Link
              href={prevHref}
              className={classNames(navBtnClass, styles.navBtn)}
              aria-label={prevAria}
            >
              <ChevronLeft size={18} strokeWidth={2} aria-hidden />
              <span className="d-none d-md-inline">{t("songPage.prev")}</span>
            </Link>
          </div>

          <div className={classNames(styles.titleBlock, "text-center")}>
            <h1 className={classNames("h2 fw-bold mb-1", styles.songTitle)}>
              {release.title}
            </h1>
            <p className={classNames("lead text-body-secondary mb-0", styles.artistLine)}>
              {artist}
            </p>
          </div>

          <div className={styles.titleNavSide}>
            <Link
              href={nextHref}
              className={classNames(navBtnClass, styles.navBtn)}
              aria-label={nextAria}
            >
              <span className="d-none d-md-inline">{t("songPage.next")}</span>
              <ChevronRight size={18} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </div>

        <div className={classNames("mb-5", styles.embedWrap)}>
          {embedUrl ? (
            <iframe
              className={styles.iframe}
              src={embedUrl}
              title={release.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 p-4 text-center text-body-secondary small">
              {release.url ? (
                <a href={release.url} target="_blank" rel="noopener noreferrer">
                  {t("songPage.watchOnYoutube")}
                </a>
              ) : (
                t("songPage.embedUnavailable")
              )}
            </div>
          )}
        </div>

        <section className="text-center">
          <SongLearnTabs verseLines={verseLines}>
            {glossary ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{glossary}</ReactMarkdown>
            ) : (
              <p className="text-body-secondary mb-0">{t("songPage.noGlossary")}</p>
            )}
          </SongLearnTabs>
        </section>
      </Container>
    </div>
  );
}
