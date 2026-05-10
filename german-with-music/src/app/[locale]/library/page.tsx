import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LibraryPageView } from "@/features/library/LibraryPageView";
import {
  librarySearchToApiArgs,
  parseLibrarySearchParams,
  serializeLibrarySearchParams,
} from "@/features/library/library-search";
import { assertLocale } from "@/i18n/assert-locale";
import { getT } from "@/i18n/server";
import { fetchYoutubeReleases } from "@/integrations/lyric-palette/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { localizedPath } from "@/lib/localized-path";
import { alternatesForPath } from "@/lib/page-metadata";

/** Always render this route on the server for each request (no static / full-route shell). */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);

  const { t } = await getT(locale);
  const siteName = t("seo.siteName");
  const pageTitle = t("library.title");
  const description = t("seo.library.description");
  const keywords = t("seo.library.keywords", {
    returnObjects: true,
  }) as string[];
  const openGraphDescription = t("seo.library.openGraphDescription");
  const twitterDescription = t("seo.library.twitterDescription");

  return {
    title: pageTitle,
    description,
    keywords: [...keywords],
    openGraph: {
      type: "website",
      siteName,
      title: pageTitle,
      description: openGraphDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: twitterDescription,
    },
    ...(alternatesForPath("/library", locale) ?? {}),
  };
}

export default async function LibraryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = assertLocale((await params).locale);
  const sp = await searchParams;
  const search = parseLibrarySearchParams(sp);

  const payload = await fetchYoutubeReleases(librarySearchToApiArgs(search));

  if (
    payload &&
    payload.meta.totalPages > 0 &&
    search.page > payload.meta.totalPages
  ) {
    const clamped = { ...search, page: payload.meta.totalPages };
    const qs = serializeLibrarySearchParams(clamped);
    const path = localizedPath("/library", locale);
    redirect(qs ? `${path}?${qs}` : path);
  }

  return (
    <MarketingShell>
      <LibraryPageView locale={locale} search={search} payload={payload} />
    </MarketingShell>
  );
}
