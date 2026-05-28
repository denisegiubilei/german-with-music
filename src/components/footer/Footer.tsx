import { LocalizedLink } from "@/components/localized-link/LocalizedLink";
import { getTForRequest } from "@/i18n/server";

export async function Footer() {
  const { t } = await getTForRequest();
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 py-4 border-top">
      <div className="container-fluid px-3 px-md-4">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between gap-3 text-body-secondary small">
          <span>
            {t("footer.copyright", { year, brand: t("brand") })}
          </span>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            <LocalizedLink
              href="/about"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              {t("footer.about")}
            </LocalizedLink>
            <LocalizedLink
              href="/contact"
              className="link-secondary link-underline-opacity-0 link-underline-opacity-100-hover"
            >
              {t("footer.contact")}
            </LocalizedLink>
          </div>
        </div>
      </div>
      <div className="german-flag-bar mt-4" />
    </footer>
  );
}
