"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useRegisterMutation } from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { appendReturnTo } from "@/lib/safe-redirect";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";

interface SignUpFormValues {
  name: string;
  login: string;
  password: string;
  confirmPassword: string;
  newsletter: boolean;
}

interface SignUpFormProps {
  copy: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    newsletterLabel: string;
    submit: string;
    submitting: string;
    hasAccount: string;
    signInLink: string;
    errorEmailTaken: string;
    errorTooMany: string;
    errorGeneric: string;
    errorEmailRequired: string;
    errorEmailInvalid: string;
    errorPasswordRequired: string;
    errorPasswordMinLength: string;
    errorConfirmPasswordRequired: string;
    errorPasswordMismatch: string;
  };
  returnTo?: string;
}

type RegisterApiError = {
  status?: number;
  data?: {
    message?: string;
    issues?: { fieldErrors?: Record<string, string[]> };
  };
};

export function SignUpForm({ copy, returnTo }: SignUpFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [registerMutation, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      login: "",
      password: "",
      confirmPassword: "",
      newsletter: true,
    },
  });

  function applyBackendFieldErrors(err: RegisterApiError): boolean {
    const fieldErrors = err.data?.issues?.fieldErrors;
    if (!fieldErrors) return false;

    let applied = false;

    if (fieldErrors.password?.[0]) {
      setError("password", { type: "server", message: fieldErrors.password[0] });
      applied = true;
    }
    if (fieldErrors.login?.[0]) {
      setError("login", { type: "server", message: fieldErrors.login[0] });
      applied = true;
    }

    return applied;
  }

  const onSubmit = handleSubmit(async ({ name, login, password, newsletter }) => {
    setErrorMsg(null);

    try {
      await registerMutation({
        login,
        password,
        newsletter,
        ...(name.trim() ? { name: name.trim() } : {}),
      }).unwrap();
      router.replace(
        appendReturnTo(localizedPath("/onboarding", locale), returnTo),
      );
    } catch (err: unknown) {
      const apiErr = err as RegisterApiError;
      const status = apiErr.status;

      if (status === 400 && applyBackendFieldErrors(apiErr)) {
        return;
      }

      if (status === 409) {
        setErrorMsg(copy.errorEmailTaken);
      } else if (status === 429) {
        setErrorMsg(copy.errorTooMany);
      } else if (status === 400 && apiErr.data?.message) {
        setErrorMsg(apiErr.data.message);
      } else {
        setErrorMsg(copy.errorGeneric);
      }
    }
  });

  return (
    <Form onSubmit={onSubmit} noValidate>
      {errorMsg && (
        <Alert variant="danger" className="py-2">
          {errorMsg}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="signup-name">
        <Form.Label>{copy.nameLabel}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="name"
          placeholder={copy.namePlaceholder}
          disabled={isLoading}
          {...register("name")}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="signup-email">
        <Form.Label>{copy.emailLabel}</Form.Label>
        <Form.Control
          type="email"
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          disabled={isLoading}
          {...register("login", {
            required: copy.errorEmailRequired,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: copy.errorEmailInvalid,
            },
          })}
          isInvalid={!!errors.login}
        />
        <Form.Control.Feedback type="invalid">
          {errors.login?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="signup-password">
        <Form.Label>{copy.passwordLabel}</Form.Label>
        <Form.Control
          type="password"
          autoComplete="new-password"
          placeholder={copy.passwordPlaceholder}
          disabled={isLoading}
          {...register("password", {
            required: copy.errorPasswordRequired,
            minLength: {
              value: 8,
              message: copy.errorPasswordMinLength,
            },
          })}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="signup-confirmPassword">
        <Form.Label>{copy.confirmPasswordLabel}</Form.Label>
        <Form.Control
          type="password"
          autoComplete="new-password"
          placeholder={copy.confirmPasswordPlaceholder}
          disabled={isLoading}
          {...register("confirmPassword", {
            required: copy.errorConfirmPasswordRequired,
            validate: (value) =>
              value === getValues("password") || copy.errorPasswordMismatch,
          })}
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4" controlId="signup-newsletter">
        <Form.Check>
          <Form.Check.Input
            type="checkbox"
            disabled={isLoading}
            {...register("newsletter")}
          />
          <Form.Check.Label>{copy.newsletterLabel}</Form.Check.Label>
        </Form.Check>
      </Form.Group>

      <Button
        type="submit"
        variant="warning"
        className="w-100 text-dark border-0 mb-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="me-2" aria-hidden />
            {copy.submitting}
          </>
        ) : (
          copy.submit
        )}
      </Button>

      <p className="text-center text-body-secondary small mb-0">
        {copy.hasAccount}{" "}
        <LocalizedLinkClient
          href={appendReturnTo("/signin", returnTo)}
          className="text-warning"
        >
          {copy.signInLink}
        </LocalizedLinkClient>
      </p>
    </Form>
  );
}
