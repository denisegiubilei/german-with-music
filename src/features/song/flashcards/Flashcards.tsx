"use client";

import classNames from "classnames";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  flashCardCodeColor,
  flashCardWordStyle,
  type FlashcardLine,
} from "@/entities/youtube-release";
import { FlashCardTextSlots } from "./FlashCardTextSlots";
import styles from "./Flashcards.module.scss";
import { mapFlashcardFaces } from "./flashcards-utils";
import { useFlashcardDeck } from "./use-flashcard-deck";

export function Flashcards({ lines }: { lines: FlashcardLine[] }) {
  const { t } = useTranslation();
  const {
    card,
    n,
    index,
    flipped,
    next,
    prev,
    shuffle,
    toggleFlip,
    onCardKeyDown,
  } = useFlashcardDeck(lines);

  if (n === 0 || !card) {
    return (
      <p className="text-body-secondary text-center mb-0">
        {t("songPage.flashcardsEmpty")}
      </p>
    );
  }

  const codeColor = flashCardCodeColor(card.code);
  const wordHighlightStyle = flashCardWordStyle(card.code);
  const faces = mapFlashcardFaces(card, {
    noTranslation: t("songPage.noTranslation"),
  });

  return (
    <div className={classNames(styles.flashRoot, "d-flex flex-column align-items-center gap-2")}>
      <div className={styles.flashTopRow}>
        <span>
          {t("songPage.flashcardProgress", { n: index + 1, total: n })}
        </span>
        <button type="button" className={styles.flashShuffleBtn} onClick={shuffle}>
          <Shuffle size={16} strokeWidth={2} aria-hidden />
          {t("songPage.flashcardShuffle")}
        </button>
      </div>

      <div
        className={styles.flashPerspective}
        role="button"
        tabIndex={0}
        onClick={toggleFlip}
        onKeyDown={onCardKeyDown}
        aria-label={t("songPage.flashcardFlipAria")}
      >
        <div
          className={classNames(styles.flashInner, flipped && styles.flashInnerFlipped)}
        >
          <div
            className={styles.flashFace}
            style={
              codeColor && !faces.showVerseContext
                ? { borderTop: `3px solid ${codeColor}` }
                : undefined
            }
          >
            <span className={styles.flashFaceLabel}>
              {t("songPage.flashcardOriginal")}
            </span>
            <FlashCardTextSlots
              contentText={faces.frontContentText}
              verseText={faces.frontVerseText}
              contentHighlighted={faces.showVerseContext}
              wordHighlightStyle={wordHighlightStyle}
            />
            <span className={styles.flashHint}>
              {t("songPage.flashcardClickToReveal")}
            </span>
          </div>
          <div className={classNames(styles.flashFace, styles.flashFaceBack)}>
            <span className={styles.flashFaceLabel}>
              {t("songPage.flashcardTranslation")}
            </span>
            <FlashCardTextSlots
              contentText={faces.backContentText}
              verseText={faces.backVerseText}
              contentHighlighted={faces.showTranslationContext}
              wordHighlightStyle={wordHighlightStyle}
              contentMuted={!faces.hasTranslation}
            />
            <span
              className={classNames(styles.flashHint, styles.flashHintInvisible)}
              aria-hidden
            >
              {t("songPage.flashcardClickToReveal")}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.flashControls}>
        <button
          type="button"
          className={styles.flashIconBtn}
          onClick={prev}
          aria-label={t("songPage.flashcardPrevAria")}
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className={styles.flashFlipBtn}
          onClick={(e) => {
            e.stopPropagation();
            toggleFlip();
          }}
        >
          <RotateCw size={16} strokeWidth={2} aria-hidden />
          {t("songPage.flashcardFlip")}
        </button>
        <button
          type="button"
          className={styles.flashIconBtn}
          onClick={next}
          aria-label={t("songPage.flashcardNextAria")}
        >
          <ChevronRight size={20} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
