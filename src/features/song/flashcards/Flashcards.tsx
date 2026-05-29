"use client";

import classNames from "classnames";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  flashCardCodeColor,
  flashCardWordStyle,
  type FlashcardLine,
} from "@/entities/youtube-release";
import { useAppSelector } from "@/store";
import { FlashCardTextSlots } from "./FlashCardTextSlots";
import { FlashcardGuestUpsell } from "./FlashcardGuestUpsell";
import styles from "./Flashcards.module.scss";
import { mapFlashcardFaces } from "./flashcards-utils";
import { useFlashcardDeck } from "./use-flashcard-deck";

const GUEST_CARD_LIMIT = 2;

export function Flashcards({ lines }: { lines: FlashcardLine[] }) {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const user = useAppSelector((state) => state.auth.user);
  const isGuest = hydrated && !user;

  if (lines.length === 0) {
    return <FlashcardsEmpty />;
  }

  if (!hydrated) {
    return (
      <div
        className={classNames(
          styles.flashRoot,
          "d-flex justify-content-center py-5",
        )}
      >
        <Spinner aria-hidden />
      </div>
    );
  }

  return (
    <FlashcardsDeck
      key={isGuest ? "guest" : "member"}
      lines={lines}
      isGuest={isGuest}
    />
  );
}

function FlashcardsEmpty() {
  const { t } = useTranslation();
  return (
    <p className="text-body-secondary text-center mb-0">
      {t("songPage.flashcardsEmpty")}
    </p>
  );
}

function FlashcardsDeck({
  lines,
  isGuest,
}: {
  lines: FlashcardLine[];
  isGuest: boolean;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const deckLines = isGuest ? lines.slice(0, GUEST_CARD_LIMIT) : lines;
  const [showUpsell, setShowUpsell] = useState(false);

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
  } = useFlashcardDeck(deckLines);

  if (n === 0 || !card) {
    return <FlashcardsEmpty />;
  }

  const codeColor = flashCardCodeColor(card.code);
  const wordHighlightStyle = flashCardWordStyle(card.code);
  const faces = mapFlashcardFaces(card, {
    noTranslation: t("songPage.noTranslation"),
  });

  const onLastGuestCard = isGuest && index === n - 1;

  function handleNext() {
    if (onLastGuestCard) {
      setShowUpsell(true);
      return;
    }
    next();
  }

  function handlePrev() {
    if (showUpsell) {
      setShowUpsell(false);
      return;
    }
    prev();
  }

  return (
    <div
      className={classNames(
        styles.flashRoot,
        "d-flex flex-column align-items-center gap-2",
      )}
    >
      <div className={styles.flashTopRow}>
        <span>
          {t("songPage.flashcardProgress", { n: index + 1, total: n })}
        </span>
        <button
          type="button"
          className={styles.flashShuffleBtn}
          onClick={shuffle}
          disabled={isGuest}
          aria-disabled={isGuest}
        >
          <Shuffle size={16} strokeWidth={2} aria-hidden />
          {t("songPage.flashcardShuffle")}
        </button>
      </div>

      <div
        className={styles.flashPerspective}
        role={showUpsell ? undefined : "button"}
        tabIndex={showUpsell ? undefined : 0}
        onClick={showUpsell ? undefined : toggleFlip}
        onKeyDown={showUpsell ? undefined : onCardKeyDown}
        aria-label={
          showUpsell ? undefined : t("songPage.flashcardFlipAria")
        }
      >
        {showUpsell ? (
          <FlashcardGuestUpsell returnTo={returnTo} />
        ) : (
          <div
            className={classNames(
              styles.flashInner,
              flipped && styles.flashInnerFlipped,
            )}
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
                className={classNames(
                  styles.flashHint,
                  styles.flashHintInvisible,
                )}
                aria-hidden
              >
                {t("songPage.flashcardClickToReveal")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.flashControls}>
        <button
          type="button"
          className={styles.flashIconBtn}
          onClick={handlePrev}
          aria-label={t("songPage.flashcardPrevAria")}
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden />
        </button>
        {!showUpsell && (
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
        )}
        {!showUpsell && (
          <button
            type="button"
            className={styles.flashIconBtn}
            onClick={handleNext}
            aria-label={t("songPage.flashcardNextAria")}
          >
            <ChevronRight size={20} strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
