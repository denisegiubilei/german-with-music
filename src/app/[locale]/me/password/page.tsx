import type { Metadata } from "next";
import { UpdatePasswordView } from "@/components/auth/UpdatePasswordView";
import { assertLocale } from "@/i18n/assert-locale";
import { getT } from "@/i18n/server";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";
import { alternatesForPath } from "@/lib/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = assertLocale((await params).locale);

  const { t } = await getT(locale);
  const siteName = t("seo.siteName");
  const pageTitle = t("auth.changePassword.title");

  return {
    title: pageTitle,
    openGraph: {
      type: "website",
      siteName,
      title: pageTitle,
    },
    twitter: {
      card: "summary",
      title: pageTitle,
    },
    ...(alternatesForPath("/me/password", locale) ?? {}),
  };
}

export default async function ChangePasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  assertLocale((await params).locale);

  return (
    <MarketingShell>
      <UpdatePasswordView />
    </MarketingShell>
  );
}
