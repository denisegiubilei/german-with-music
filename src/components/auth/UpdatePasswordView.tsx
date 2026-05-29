"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Container,
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import { KeyRound, ChevronLeft } from "lucide-react";
import {
  useGetMeQuery,
  useUpdatePasswordMutation,
} from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { useTranslation } from "react-i18next";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";

interface UpdatePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

type UpdatePasswordApiError = {
  status?: number;
  data?: {
    message?: string;
    issues?: { fieldErrors?: Record<string, string[]> };
  };
};

export function UpdatePasswordView() {
  const router = useRouter();
  const locale = useLocale();
  const { t } = useTranslation("common");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { isLoading, isError } = useGetMeQuery();
  const [updatePassword, { isLoading: isSubmitting }] =
    useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (isError) {
      router.replace(localizedPath("/signin", locale));
    }
  }, [isError, router, locale]);

  function applyBackendFieldErrors(err: UpdatePasswordApiError): boolean {
    const fieldErrors = err.data?.issues?.fieldErrors;
    if (!fieldErrors) return false;

    let applied = false;

    if (fieldErrors.currentPassword?.[0]) {
      setError("currentPassword", {
        type: "server",
        message: fieldErrors.currentPassword[0],
      });
      applied = true;
    }
    if (fieldErrors.newPassword?.[0]) {
      setError("newPassword", {
        type: "server",
        message: fieldErrors.newPassword[0],
      });
      applied = true;
    }

    return applied;
  }

  const onSubmit = handleSubmit(
    async ({ currentPassword, newPassword }) => {
      setErrorMsg(null);
      setSuccess(false);

      try {
        await updatePassword({ currentPassword, newPassword }).unwrap();
        reset();
        setSuccess(true);
      } catch (err: unknown) {
        const apiErr = err as UpdatePasswordApiError;
        const status = apiErr.status;
        const message = apiErr.data?.message ?? "";

        if (applyBackendFieldErrors(apiErr)) {
          return;
        }

        if (status === 401 && message.includes("Invalid current password")) {
          setErrorMsg(t("auth.changePassword.errorCurrentInvalid"));
          return;
        }

        if (status === 401) {
          router.replace(localizedPath("/signin", locale));
          return;
        }

        if (status === 429) {
          setErrorMsg(t("auth.changePassword.errorTooMany"));
          return;
        }

        if (
          status === 400 &&
          message.toLowerCase().includes("currentpassword")
        ) {
          setErrorMsg(t("auth.changePassword.errorSamePassword"));
          return;
        }

        setErrorMsg(t("auth.changePassword.errorGeneric"));
      }
    },
  );

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner aria-label="Loading…" />
      </Container>
    );
  }

  if (isError) return null;

  return (
    <Container className="d-flex justify-content-center py-5">
      <div style={{ width: "100%", maxWidth: 480 }}>
        <p className="mb-3">
          <LocalizedLinkClient
            href="/me"
            className="d-inline-flex align-items-center gap-1 small text-body-secondary text-decoration-none"
          >
            <ChevronLeft size={16} aria-hidden />
            {t("auth.changePassword.backToAccount")}
          </LocalizedLinkClient>
        </p>

        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 64, height: 64 }}
          >
            <KeyRound size={28} className="text-dark" aria-hidden />
          </div>
          <h1 className="h3 fw-bold">{t("auth.changePassword.title")}</h1>
          <p className="text-body-secondary small mb-0">
            {t("auth.changePassword.subtitle")}
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardBody className="p-4">
            {success && (
              <Alert variant="success" className="py-2">
                {t("auth.changePassword.success")}
              </Alert>
            )}
            {errorMsg && (
              <Alert variant="danger" className="py-2">
                {errorMsg}
              </Alert>
            )}

            <Form onSubmit={onSubmit} noValidate>
              <Form.Group className="mb-3" controlId="change-password-current">
                <Form.Label>
                  {t("auth.changePassword.currentPasswordLabel")}
                </Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  {...register("currentPassword", {
                    required: t(
                      "auth.changePassword.errorCurrentPasswordRequired",
                    ),
                  })}
                  isInvalid={!!errors.currentPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="change-password-new">
                <Form.Label>
                  {t("auth.changePassword.newPasswordLabel")}
                </Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="new-password"
                  placeholder={t(
                    "auth.changePassword.newPasswordPlaceholder",
                  )}
                  disabled={isSubmitting}
                  {...register("newPassword", {
                    required: t(
                      "auth.changePassword.errorNewPasswordRequired",
                    ),
                    minLength: {
                      value: 8,
                      message: t(
                        "auth.changePassword.errorNewPasswordMinLength",
                      ),
                    },
                    validate: (value) =>
                      value !== getValues("currentPassword") ||
                      t("auth.changePassword.errorSamePassword"),
                  })}
                  isInvalid={!!errors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="change-password-confirm">
                <Form.Label>
                  {t("auth.changePassword.confirmPasswordLabel")}
                </Form.Label>
                <Form.Control
                  type="password"
                  autoComplete="new-password"
                  placeholder={t(
                    "auth.changePassword.confirmPasswordPlaceholder",
                  )}
                  disabled={isSubmitting}
                  {...register("confirmNewPassword", {
                    required: t(
                      "auth.changePassword.errorConfirmPasswordRequired",
                    ),
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      t("auth.signUp.errorPasswordMismatch"),
                  })}
                  isInvalid={!!errors.confirmNewPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmNewPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="warning"
                className="w-100 text-dark border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" aria-hidden />
                    {t("auth.changePassword.submitting")}
                  </>
                ) : (
                  t("auth.changePassword.submit")
                )}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
