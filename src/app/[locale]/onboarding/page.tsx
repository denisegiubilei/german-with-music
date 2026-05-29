import { getTForRequest } from "@/i18n/server";
import { OnboardingView } from "@/components/auth/OnboardingView";

export default async function OnboardingPage() {
  await getTForRequest();

  return <OnboardingView />;
}
