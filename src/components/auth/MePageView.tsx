"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, CardBody, Button, Spinner } from "react-bootstrap";
import { User } from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { useTranslation } from "react-i18next";

export function MePageView() {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation("common");

  const { data: user, isLoading, isError } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    if (isError) {
      router.replace(localizedPath("/signin", locale));
    }
  }, [isError, router, locale]);

  async function handleLogout() {
    await logout().unwrap().catch(() => {});
    router.replace(localizedPath("/", locale));
  }

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner aria-label="Loading…" />
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container className="d-flex justify-content-center py-5">
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 64, height: 64 }}
          >
            <User size={28} className="text-dark" aria-hidden />
          </div>
          <h1 className="h3 fw-bold">{t("auth.me.title")}</h1>
        </div>

        <Card className="border shadow-sm">
          <CardBody className="p-4">
            <dl className="mb-4">
              <div className="mb-3">
                <dt className="small text-body-secondary fw-semibold text-uppercase mb-1">
                  {t("auth.me.nameLabel")}
                </dt>
                <dd className="mb-0 fw-medium">
                  {user.name ?? (
                    <span className="text-body-secondary fst-italic">
                      {t("auth.me.nameFallback")}
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="small text-body-secondary fw-semibold text-uppercase mb-1">
                  {t("auth.me.emailLabel")}
                </dt>
                <dd className="mb-0">{user.login}</dd>
              </div>
            </dl>

            <Button
              variant="outline-danger"
              className="w-100"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Spinner size="sm" className="me-2" aria-hidden />
                  {t("auth.me.signOut")}…
                </>
              ) : (
                t("auth.me.signOut")
              )}
            </Button>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
