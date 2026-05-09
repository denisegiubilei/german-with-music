import { BookOpen, Headphones, Languages, Trophy } from "lucide-react";
import type { HowItWorksStep } from "@/types/how-it-works";

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    icon: Headphones,
    title: "Escolha uma música",
    description: "Navegue por nossa biblioteca de músicas alemãs.",
  },
  {
    icon: BookOpen,
    title: "Leia as letras",
    description: "Acompanhe a letra original enquanto ouve.",
  },
  {
    icon: Languages,
    title: "Compare",
    description: "Veja a tradução lado a lado com o original.",
  },
  {
    icon: Trophy,
    title: "Aprenda",
    description: "Absorva vocabulário de forma natural.",
  },
];
