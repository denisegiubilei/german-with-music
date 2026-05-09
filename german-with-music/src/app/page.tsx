import { FeaturedSongs } from "@/features/home/featured-songs/FeaturedSongs";
import { HeroSection } from "@/features/home/hero-section/HeroSection";
import { HowItWorks } from "@/features/home/how-it-works/HowItWorks";
import { LyricsSection } from "@/features/home/lyrics-section/LyricsSection";
import { MarketingShell } from "@/layouts/marketing-shell/MarketingShell";

export default function Home() {
  return (
    <MarketingShell>
      <HeroSection />
      <FeaturedSongs />
      <HowItWorks />
      <LyricsSection />
    </MarketingShell>
  );
}
