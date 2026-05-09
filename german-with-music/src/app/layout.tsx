import { Geist_Mono, Inter } from "next/font/google";
import { initServerI18next } from "next-i18next/server";
import i18nConfig from "../../i18n.config";
import { getRequestLocale } from "@/i18n/request-locale";
import "./globals.scss";

initServerI18next(i18nConfig);

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const htmlLang = await getRequestLocale();

  return (
    <html
      lang={htmlLang}
      className={`${inter.variable} ${geistMono.variable} h-100`}
    >
      <body className="min-vh-100 d-flex flex-column">{children}</body>
    </html>
  );
}
