import type { LucideIcon } from "lucide-react";

export type HowItWorksStepId = "choose" | "read" | "compare" | "learn";

export interface HowItWorksStep {
  icon: LucideIcon;
  id: HowItWorksStepId;
}
