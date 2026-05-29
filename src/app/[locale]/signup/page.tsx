import { Container, Card, CardBody } from "react-bootstrap";
import { getTForRequest } from "@/i18n/server";
import { SignUpForm } from "@/components/auth/SignUpForm";

interface SignUpPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { t } = await getTForRequest();
  const { returnTo: returnToRaw } = await searchParams;
  const returnTo = Array.isArray(returnToRaw) ? returnToRaw[0] : returnToRaw;

  const copy = {
    nameLabel: t("auth.signUp.nameLabel"),
    namePlaceholder: t("auth.signUp.namePlaceholder"),
    emailLabel: t("auth.signUp.emailLabel"),
    emailPlaceholder: t("auth.signUp.emailPlaceholder"),
    passwordLabel: t("auth.signUp.passwordLabel"),
    passwordPlaceholder: t("auth.signUp.passwordPlaceholder"),
    confirmPasswordLabel: t("auth.signUp.confirmPasswordLabel"),
    confirmPasswordPlaceholder: t("auth.signUp.confirmPasswordPlaceholder"),
    newsletterLabel: t("auth.signUp.newsletterLabel"),
    submit: t("auth.signUp.submit"),
    submitting: t("auth.signUp.submitting"),
    hasAccount: t("auth.signUp.hasAccount"),
    signInLink: t("auth.signUp.signInLink"),
    errorEmailTaken: t("auth.signUp.errorEmailTaken"),
    errorTooMany: t("auth.signUp.errorTooMany"),
    errorGeneric: t("auth.signUp.errorGeneric"),
    errorEmailRequired: t("auth.signUp.errorEmailRequired"),
    errorEmailInvalid: t("auth.signUp.errorEmailInvalid"),
    errorPasswordRequired: t("auth.signUp.errorPasswordRequired"),
    errorPasswordMinLength: t("auth.signUp.errorPasswordMinLength"),
    errorConfirmPasswordRequired: t("auth.signUp.errorConfirmPasswordRequired"),
    errorPasswordMismatch: t("auth.signUp.errorPasswordMismatch"),
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold">{t("auth.signUp.title")}</h1>
          <p className="text-body-secondary">{t("auth.signUp.subtitle")}</p>
        </div>
        <Card className="border shadow-sm">
          <CardBody className="p-4">
            <SignUpForm copy={copy} returnTo={returnTo} />
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
