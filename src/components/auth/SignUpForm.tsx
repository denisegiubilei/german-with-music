"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useRegisterMutation } from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";

interface SignUpFormProps {
  copy: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submit: string;
    submitting: string;
    hasAccount: string;
    signInLink: string;
    errorEmailTaken: string;
    errorTooMany: string;
    errorGeneric: string;
  };
}

export function SignUpForm({ copy }: SignUpFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [registerMutation, { isLoading }] = useRegisterMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await registerMutation({
        login,
        password,
        ...(name.trim() ? { name: name.trim() } : {}),
      }).unwrap();
      router.replace(localizedPath("/", locale));
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        setErrorMsg(copy.errorEmailTaken);
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

      <Form.Group className="mb-3" controlId="signup-name">
        <Form.Label>{copy.nameLabel}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="name"
          placeholder={copy.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="signup-email">
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

      <Form.Group className="mb-4" controlId="signup-password">
        <Form.Label>{copy.passwordLabel}</Form.Label>
        <Form.Control
          type="password"
          autoComplete="new-password"
          placeholder={copy.passwordPlaceholder}
          minLength={8}
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
        {copy.hasAccount}{" "}
        <LocalizedLinkClient href="/signin" className="text-warning">
          {copy.signInLink}
        </LocalizedLinkClient>
      </p>
    </Form>
  );
}
