import { BookOpen, Headphones, Languages, Trophy } from "lucide-react";
import type { HowItWorksStep } from "@/types/how-it-works";

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { icon: Headphones, id: "choose" },
  { icon: BookOpen, id: "read" },
  { icon: Languages, id: "compare" },
  { icon: Trophy, id: "learn" },
];
