"use client";

import { useTranslation } from "react-i18next";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";
import { appendReturnTo } from "@/lib/safe-redirect";
import styles from "./Flashcards.module.scss";

export function FlashcardGuestUpsell({ returnTo }: { returnTo: string }) {
  const { t } = useTranslation();

  const signUpHref = appendReturnTo("/signup", returnTo);
  const signInHref = appendReturnTo("/signin", returnTo);

  return (
    <div className={styles.flashUpsell}>
      <h3 className={styles.flashUpsellTitle}>
        {t("songPage.flashcardGuestTitle")}
      </h3>
      <p className={styles.flashUpsellBody}>
        {t("songPage.flashcardGuestBody")}
      </p>
      <LocalizedLinkClient
        href={signUpHref}
        className="btn btn-warning text-dark border-0"
      >
        {t("songPage.flashcardGuestSignUp")}
      </LocalizedLinkClient>
      <p className={styles.flashUpsellSignIn}>
        {t("songPage.flashcardGuestSignIn")}{" "}
        <LocalizedLinkClient href={signInHref} className="text-warning">
          {t("nav.signIn")}
        </LocalizedLinkClient>
      </p>
    </div>
  );
}
