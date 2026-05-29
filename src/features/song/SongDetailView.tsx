import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import {
  releaseFlashCardsToLines,
  type YoutubeRelease,
} from "@/entities/youtube-release";
import { getT } from "@/i18n/server";
import type { Locale } from "@/i18n/settings";
import { fetchReleaseFlashCards } from "@/integrations/lyric-palette/server";
import { localizedPath } from "@/lib/localized-path";
import { youtubeWatchUrlToEmbedUrl } from "@/shared/lib/youtube";
import { SongLearnTabs } from "./SongLearnTabs";
import styles from "./SongDetailView.module.scss";

export async function SongDetailView({
  release,
  locale,
  neighborPrevSlug,
  neighborNextSlug,
}: {
  release: YoutubeRelease;
  locale: Locale;
  neighborPrevSlug: string | null;
  neighborNextSlug: string | null;
}) {
  const { t } = await getT(locale);
  const libraryHref = localizedPath("/library", locale);
  const prevHref = neighborPrevSlug
    ? localizedPath(`/song/${neighborPrevSlug}`, locale)
    : libraryHref;
  const nextHref = neighborNextSlug
    ? localizedPath(`/song/${neighborNextSlug}`, locale)
    : libraryHref;
  const prevAria = neighborPrevSlug
    ? t("songPage.prevAria")
    : t("songPage.navToLibraryAria");
  const nextAria = neighborNextSlug
    ? t("songPage.nextAria")
    : t("songPage.navToLibraryAria");
  const embedUrl = youtubeWatchUrlToEmbedUrl(release.url);
  const glossary = release.glossary?.trim()
    ? release.glossary
    : null;

  const flashCardsPayload = await fetchReleaseFlashCards(release.slug);
  const verseLines = releaseFlashCardsToLines(flashCardsPayload?.cards ?? []);
  const artist = release.artist?.trim() ?? null;

  const navBtnClass =
    "btn btn-primary d-inline-flex align-items-center gap-1";

  return (
    <div className="py-4 py-md-5">
      <Container className="px-3 px-md-4">
        <nav aria-label={t("about.breadcrumbLabel")}>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link href={localizedPath("/", locale)}>
                {t("about.breadcrumbHome")}
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={libraryHref}>{t("nav.library")}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {release.title}
            </li>
          </ol>
        </nav>

        <article>
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
            <header>
              <h1 className={classNames("h2 fw-bold mb-0", styles.songTitle)}>
                {release.title}
              </h1>
              {artist ? (
                <p className="text-body-secondary mb-0 mt-2">{artist}</p>
              ) : null}
            </header>
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

        <section className="text-center" aria-label={t("songPage.glossaryHeading")}>
          <SongLearnTabs glossary={glossary} verseLines={verseLines} />
        </section>
        </article>
      </Container>
    </div>
  );
}
