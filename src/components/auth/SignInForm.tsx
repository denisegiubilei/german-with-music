"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useLoginMutation } from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";
import { isSafeReturnTo } from "@/lib/safe-redirect";

interface SignInFormProps {
  copy: {
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submit: string;
    submitting: string;
    noAccount: string;
    signUpLink: string;
    errorInvalid: string;
    errorTooMany: string;
    errorGeneric: string;
  };
  returnTo?: string;
}

export function SignInForm({ copy, returnTo }: SignInFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loginMutation, { isLoading }] = useLoginMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await loginMutation({ login, password }).unwrap();
      const destination =
        returnTo && isSafeReturnTo(returnTo)
          ? returnTo
          : localizedPath("/", locale);
      router.replace(destination);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 401) {
        setErrorMsg(copy.errorInvalid);
      } else if (status === 429) {
        setErrorMsg(copy.errorTooMany);
      } else {
        setErrorMsg(copy.errorGeneric);
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {errorMsg && (
        <Alert variant="danger" className="py-2">
          {errorMsg}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="signin-email">
        <Form.Label>{copy.emailLabel}</Form.Label>
        <Form.Control
          type="email"
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-4" controlId="signin-password">
        <Form.Label>{copy.passwordLabel}</Form.Label>
        <Form.Control
          type="password"
          autoComplete="current-password"
          placeholder={copy.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
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
        {copy.noAccount}{" "}
        <LocalizedLinkClient href="/signup" className="text-warning">
          {copy.signUpLink}
        </LocalizedLinkClient>
      </p>
    </Form>
  );
}
