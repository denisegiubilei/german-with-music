import Link from "next/link";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { SongCard } from "@/components/song-card/SongCard";
import type { YoutubeReleasesListResponse } from "@/entities/youtube-release";
import { getT } from "@/i18n/server";
import type { Locale } from "@/i18n/settings";
import { localizedPath } from "@/lib/localized-path";
import {
  youtubeWatchUrlToEmbedUrl,
  youtubeWatchUrlToThumbnailUrl,
} from "@/shared/lib/youtube";
// import { LibraryFiltersPanel } from "./LibraryFiltersPanel";
import type { LibrarySearchState } from "./library-search";
import { serializeLibrarySearchParams } from "./library-search";

function libraryHref(locale: Locale, state: LibrarySearchState): string {
  const base = localizedPath("/library", locale);
  const qs = serializeLibrarySearchParams(state);
  return qs ? `${base}?${qs}` : base;
}

export async function LibraryPageView({
  locale,
  search,
  payload,
}: {
  locale: Locale;
  search: LibrarySearchState;
  payload: YoutubeReleasesListResponse | null;
}) {
  const { t } = await getT(locale);
  // const formAction = localizedPath("/library", locale);
  const fetchFailed = payload === null;
  const items = payload?.data ?? [];
  const meta = payload?.meta;
  const total = meta?.total ?? 0;
  const page = meta?.page ?? search.page;
  const pageSize = meta?.pageSize ?? 0;
  const totalPages = meta?.totalPages ?? 0;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <Container className="py-5 px-3 px-md-4">
      <h1 className="h2 mb-2">{t("library.title")}</h1>
      <p className="text-body-secondary mb-4">{t("library.lead")}</p>

      {/* TEMP: filters disabled — library is hardcoded to artist LERNIKA in librarySearchToApiArgs */}
      {/* <LibraryFiltersPanel
        formAction={formAction}
        defaultArtist={search.artist}
        defaultTitle={search.title}
      /> */}

      {!fetchFailed && total > 0 ? (
        <p className="text-body-secondary small mb-3">
          {t("library.paginationSummary", { from, to, total })}
        </p>
      ) : null}

      {fetchFailed ? (
        <Alert variant="danger" className="mb-0">
          {t("library.error")}
        </Alert>
      ) : items.length === 0 ? (
        <p className="text-body-secondary mb-0">{t("library.empty")}</p>
      ) : (
        <>
          <Row className="g-3 g-md-4 mb-4">
            {items.map((release) => (
              <Col key={release.slug} xs={12} sm={6} lg={4}>
                <SongCard
                  title={release.title}
                  artist={release.artist}
                  thumbnailSrc={youtubeWatchUrlToThumbnailUrl(release.url)}
                  embedUrl={youtubeWatchUrlToEmbedUrl(release.url)}
                  watchUrl={release.url}
                  detailHref={`/song/${release.slug}`}
                />
              </Col>
            ))}
          </Row>
          {totalPages > 1 ? (
            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
              <nav aria-label={t("library.paginationNav")}>
                <ul className="pagination mb-0">
                  <li
                    className={`page-item${page <= 1 ? " disabled" : ""}`}
                  >
                    {page > 1 ? (
                      <Link
                        className="page-link"
                        href={libraryHref(locale, {
                          ...search,
                          page: page - 1,
                        })}
                        aria-label={t("library.pagePrevAria")}
                      >
                        <span aria-hidden="true">‹</span>
                      </Link>
                    ) : (
                      <span
                        className="page-link"
                        tabIndex={-1}
                        aria-disabled="true"
                        aria-label={t("library.pagePrevAria")}
                      >
                        <span aria-hidden="true">‹</span>
                      </span>
                    )}
                  </li>
                  <li
                    className={`page-item${page >= totalPages ? " disabled" : ""}`}
                  >
                    {page < totalPages ? (
                      <Link
                        className="page-link"
                        href={libraryHref(locale, {
                          ...search,
                          page: page + 1,
                        })}
                        aria-label={t("library.pageNextAria")}
                      >
                        <span aria-hidden="true">›</span>
                      </Link>
                    ) : (
                      <span
                        className="page-link"
                        tabIndex={-1}
                        aria-disabled="true"
                        aria-label={t("library.pageNextAria")}
                      >
                        <span aria-hidden="true">›</span>
                      </span>
                    )}
                  </li>
                </ul>
              </nav>
              <span className="text-body-secondary small">
                {t("library.pageStatus", { page, totalPages })}
              </span>
            </div>
          ) : null}
        </>
      )}
    </Container>
  );
}
