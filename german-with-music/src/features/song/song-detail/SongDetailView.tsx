import classNames from "classnames";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import type { YoutubeRelease } from "@/entities/youtube-release";
import { getT } from "@/i18n/server";
import type { Locale } from "@/i18n/settings";
import { localizedPath } from "@/lib/localized-path";
import { youtubeWatchUrlToEmbedUrl } from "@/shared/lib/youtube";
import styles from "./SongDetailView.module.scss";

export async function SongDetailView({
  release,
  locale,
}: {
  release: YoutubeRelease;
  locale: Locale;
}) {
  const { t } = await getT(locale);
  const homeHref = localizedPath("/", locale);
  const embedUrl = youtubeWatchUrlToEmbedUrl(release.url);
  const artist = release.artist?.trim() ? release.artist : "—";
  const glossary = release.glossary?.trim()
    ? release.glossary
    : null;

  return (
    <div className="py-4 py-md-5">
      <Container className="px-3 px-md-4">
        <p className="small text-body-secondary mb-2">
          <Link
            href={homeHref}
            className="link-secondary link-underline-opacity-25"
          >
            {t("songPage.backHome")}
          </Link>
        </p>
        <h1 className="h2 fw-bold mb-1">{release.title}</h1>
        <p className="lead text-body-secondary mb-4 mb-md-5">{artist}</p>

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
          <h2 className="h5 fw-semibold text-uppercase small text-body-secondary mb-3">
            {t("songPage.glossaryHeading")}
          </h2>
          {glossary ? (
            <p className={classNames("text-body mb-0", styles.glossary)}>
              {glossary}
            </p>
          ) : (
            <p className="text-body-secondary mb-0">{t("songPage.noGlossary")}</p>
          )}
        </section>
      </Container>
    </div>
  );
}
