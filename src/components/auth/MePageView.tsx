"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { User, ChevronRight } from "lucide-react";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";
import {
  useGetMeQuery,
  useLogoutMutation,
  useUpdateMeMutation,
} from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { useTranslation } from "react-i18next";
import { ProfileFieldsForm } from "./ProfileFieldsForm";
import type { UpdateProfileRequest } from "@/entities/user";

export function MePageView() {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation("common");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: user, isLoading, isError } = useGetMeQuery();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();

  useEffect(() => {
    if (isError) {
      router.replace(localizedPath("/signin", locale));
    }
  }, [isError, router, locale]);

  async function handleLogout() {
    await logout().unwrap().catch(() => {});
    router.replace(localizedPath("/", locale));
  }

  async function handleProfileSave(patch: UpdateProfileRequest) {
    setSaveError(null);
    setSaveSuccess(false);

    if (Object.keys(patch).length === 0) {
      return;
    }

    try {
      await updateMe(patch).unwrap();
      setSaveSuccess(true);
    } catch {
      setSaveError(t("auth.me.saveError"));
    }
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

        <Card className="border shadow-sm mb-4">
          <CardBody className="p-4">
            <dl className="mb-0">
              <div>
                <dt className="small text-body-secondary fw-semibold text-uppercase mb-1">
                  {t("auth.me.emailLabel")}
                </dt>
                <dd className="mb-0">{user.login}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card className="border shadow-sm mb-4">
          <CardBody className="p-4">
            <h2 className="h5 fw-bold mb-3">{t("auth.me.profileTitle")}</h2>

            {saveSuccess && (
              <Alert variant="success" className="py-2">
                {t("auth.me.saved")}
              </Alert>
            )}
            {saveError && (
              <Alert variant="danger" className="py-2">
                {saveError}
              </Alert>
            )}

            <ProfileFieldsForm
              key={[
                user.name,
                user.howFound,
                user.germanLevel,
                user.country,
                user.language,
                user.goals,
              ].join("|")}
              initialValues={user}
              includeName
              onSubmit={handleProfileSave}
              submitLabel={t("auth.profile.save")}
              submittingLabel={t("auth.onboarding.submitting")}
              isSubmitting={isSaving}
            />
          </CardBody>
        </Card>

        <Card className="border shadow-sm mb-4">
          <CardBody className="p-0">
            <LocalizedLinkClient
              href="/me/password"
              className="d-flex align-items-center justify-content-between px-4 py-3 text-decoration-none text-body"
            >
              <span className="fw-semibold">
                {t("auth.me.changePasswordLink")}
              </span>
              <ChevronRight size={18} className="text-body-secondary" aria-hidden />
            </LocalizedLinkClient>
          </CardBody>
        </Card>

        <Button
          variant="outline-danger"
          className="w-100"
          onClick={handleLogout}
          disabled={isLoggingOut || isSaving}
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
      </div>
    </Container>
  );
}
