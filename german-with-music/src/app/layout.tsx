import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { I18nProvider } from "@/i18n/I18nProvider";
import en from "@/locales/en.json";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { siteName, titleTagline, description, keywords, openGraphDescription, twitterDescription } =
  en.seo;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const defaultTitle = `${siteName} — ${titleTagline}`;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [...keywords],
  openGraph: {
    type: "website",
    siteName,
    title: defaultTitle,
    description: openGraphDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: twitterDescription,
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
      <body className="min-vh-100 d-flex flex-column">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
