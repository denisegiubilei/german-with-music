import { getTForRequest } from "@/i18n/server";
import { OnboardingView } from "@/components/auth/OnboardingView";

interface OnboardingPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  await getTForRequest();
  const { returnTo: returnToRaw } = await searchParams;
  const returnTo = Array.isArray(returnToRaw) ? returnToRaw[0] : returnToRaw;

  return <OnboardingView returnTo={returnTo} />;
}
