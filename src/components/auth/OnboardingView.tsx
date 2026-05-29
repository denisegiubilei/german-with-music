"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, CardBody, Button, Spinner, Alert } from "react-bootstrap";
import { X } from "lucide-react";
import {
  useGetMeQuery,
  useUpdateMeMutation,
} from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { useTranslation } from "react-i18next";
import { ProfileFieldsForm } from "./ProfileFieldsForm";
import type { UpdateProfileRequest } from "@/entities/user";

export function OnboardingView() {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation("common");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: user, isLoading, isError } = useGetMeQuery();
  const [updateMe, { isLoading: isSubmitting }] = useUpdateMeMutation();

  useEffect(() => {
    if (isError) {
      router.replace(localizedPath("/signin", locale));
    }
  }, [isError, router, locale]);

  function goToLibrary() {
    router.replace(localizedPath("/library", locale));
  }

  async function handleSubmit(patch: UpdateProfileRequest) {
    setErrorMsg(null);

    if (Object.keys(patch).length === 0) {
      goToLibrary();
      return;
    }

    try {
      await updateMe(patch).unwrap();
      goToLibrary();
    } catch {
      setErrorMsg(t("auth.onboarding.errorGeneric"));
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
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div className="position-relative text-center mb-4">
          <Button
            variant="link"
            className="position-absolute top-0 end-0 text-body-secondary p-0"
            onClick={goToLibrary}
            aria-label={t("auth.onboarding.skip")}
          >
            <X size={20} aria-hidden />
          </Button>
          <h1 className="h3 fw-bold">{t("auth.onboarding.title")}</h1>
          <p className="text-body-secondary mb-0">
            {t("auth.onboarding.subtitle")}
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardBody className="p-4">
            {errorMsg && (
              <Alert variant="danger" className="py-2">
                {errorMsg}
              </Alert>
            )}

            <ProfileFieldsForm
              initialValues={user}
              onSubmit={handleSubmit}
              submitLabel={t("auth.onboarding.continue")}
              submittingLabel={t("auth.onboarding.submitting")}
              isSubmitting={isSubmitting}
            />

            <div className="text-center mt-3">
              <Button
                variant="link"
                className="text-body-secondary small p-0"
                onClick={goToLibrary}
                disabled={isSubmitting}
              >
                {t("auth.onboarding.skip")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
