import type { ReleaseFlashCard, ReleaseFlashCardTranslation } from "./types";

export const DEFAULT_FLASH_CARD_TRANSLATION_LANG = "en";

function pickFlashCardTranslation(
  translations: ReleaseFlashCard["translations"],
  lang: string = DEFAULT_FLASH_CARD_TRANSLATION_LANG,
): ReleaseFlashCardTranslation | undefined {
  return translations.find((r) => r.lang === lang);
}

export interface FlashcardLine {
  /** Card prompt / highlighted fragment (source language). */
  content: string;
  /** Full source-language verse line. */
  verse: string;
  /** Translated card prompt. */
  translation: string;
  /** Full translated verse line. */
  verseTranslation: string;
  /** Word-class id (`0` = none). */
  code: number;
}

/** Maps public API flash cards to the song flashcard UI. */
export function releaseFlashCardsToLines(
  cards: ReleaseFlashCard[],
  translationLang: string = DEFAULT_FLASH_CARD_TRANSLATION_LANG,
): FlashcardLine[] {
  return cards.map((card) => {
    const row = pickFlashCardTranslation(card.translations, translationLang);
    return {
      content: card.content.trim(),
      verse: card.verse.trim(),
      translation: row?.translation.trim() ?? "",
      verseTranslation: row?.verseTranslation.trim() ?? "",
      code: card.code,
    };
  });
}
