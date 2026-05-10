import Link from "next/link";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
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
  const formAction = localizedPath("/library", locale);
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

      <Form
        method="get"
        action={formAction}
        className="border rounded-3 p-3 p-md-4 mb-4 bg-body-secondary"
      >
        <Row className="g-3 align-items-end">
          <Col xs={12} md={4}>
            <Form.Label htmlFor="library-filter-artist" className="small">
              {t("library.filterArtist")}
            </Form.Label>
            <Form.Control
              id="library-filter-artist"
              name="artist"
              type="search"
              defaultValue={search.artist}
              autoComplete="off"
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Label htmlFor="library-filter-title" className="small">
              {t("library.filterTitle")}
            </Form.Label>
            <Form.Control
              id="library-filter-title"
              name="title"
              type="search"
              defaultValue={search.title}
              autoComplete="off"
            />
          </Col>
          <Col xs={12} md={4} className="d-flex flex-wrap gap-2">
            <Button type="submit" variant="warning" className="text-dark">
              {t("library.applyFilters")}
            </Button>
            <Link
              href={formAction}
              className="btn btn-outline-secondary"
            >
              {t("library.clearFilters")}
            </Link>
          </Col>
        </Row>
      </Form>

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
              <Col key={release.id} xs={12} sm={6} lg={4}>
                <SongCard
                  title={release.title}
                  artist={release.artist}
                  thumbnailSrc={youtubeWatchUrlToThumbnailUrl(release.url)}
                  embedUrl={youtubeWatchUrlToEmbedUrl(release.url)}
                  watchUrl={release.url}
                  detailHref={`/song/${release.id}`}
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
