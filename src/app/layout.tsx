import classNames from "classnames";
import { Geist_Mono, Inter } from "next/font/google";
import { initServerI18next } from "next-i18next/server";
import i18nConfig from "../../i18n.config";
import { getRequestLocale } from "@/i18n/request-locale";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { THEME_BOOT_INLINE_SCRIPT } from "@/lib/theme-preference";
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
      className={classNames(inter.variable, geistMono.variable, "h-100")}
      suppressHydrationWarning
    >
      <head>
        {/* Theme boot: server-only <script> — next/script is a client module and React 19 skips those scripts on the client. */}
        <script
          id="gwm-theme-boot"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_INLINE_SCRIPT }}
        />
      </head>
      <body className="min-vh-100 d-flex flex-column">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
