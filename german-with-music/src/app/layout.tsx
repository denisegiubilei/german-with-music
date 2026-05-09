import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "German with Music";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: `${siteName} — Learn German with song lyrics`,
    template: `%s | ${siteName}`,
  },
  description:
    "Learn German through music: curated German songs with original lyrics and Portuguese translations. Build vocabulary and listening skills in context—free to explore.",
  keywords: [
    "learn German",
    "German songs",
    "German lyrics",
    "Portuguese translation",
    "language learning",
    "music and language",
  ],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Learn German with song lyrics`,
    description:
      "German songs with lyrics and Portuguese side-by-side translations. Practice German vocabulary and listening with real music.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Learn German with song lyrics`,
    description:
      "German songs with lyrics and Portuguese translations. Learn vocabulary in context.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-100`}>
      <body className="min-vh-100 d-flex flex-column">{children}</body>
    </html>
  );
}
