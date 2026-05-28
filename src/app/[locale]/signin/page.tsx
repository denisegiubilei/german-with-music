import { Container, Card, CardBody } from "react-bootstrap";
import { getTForRequest } from "@/i18n/server";
import { SignInForm } from "@/components/auth/SignInForm";

interface SignInPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { t } = await getTForRequest();
  const { returnTo: returnToRaw } = await searchParams;
  const returnTo = Array.isArray(returnToRaw) ? returnToRaw[0] : returnToRaw;

  const copy = {
    emailLabel: t("auth.signIn.emailLabel"),
    emailPlaceholder: t("auth.signIn.emailPlaceholder"),
    passwordLabel: t("auth.signIn.passwordLabel"),
    passwordPlaceholder: t("auth.signIn.passwordPlaceholder"),
    submit: t("auth.signIn.submit"),
    submitting: t("auth.signIn.submitting"),
    noAccount: t("auth.signIn.noAccount"),
    signUpLink: t("auth.signIn.signUpLink"),
    errorInvalid: t("auth.signIn.errorInvalid"),
    errorTooMany: t("auth.signIn.errorTooMany"),
    errorGeneric: t("auth.signIn.errorGeneric"),
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold">{t("auth.signIn.title")}</h1>
          <p className="text-body-secondary">{t("auth.signIn.subtitle")}</p>
        </div>
        <Card className="border shadow-sm">
          <CardBody className="p-4">
            <SignInForm copy={copy} returnTo={returnTo} />
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
