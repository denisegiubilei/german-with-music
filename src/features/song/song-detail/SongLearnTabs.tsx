"use client";

import classNames from "classnames";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCw,
  Shuffle,
} from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { flashCardCodeColor, flashCardWordStyle } from "@/entities/youtube-release";
import glossaryStyles from "./SongDetailView.module.scss";
import styles from "./SongLearnTabs.module.scss";

export interface VerseFlashcardLine {
  content: string;
  verse: string;
  translation: string;
  verseTranslation: string;
  code: number;
}

function shuffleArray<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

interface FlashCardTextSlotsProps {
  contentText: string;
  verseText: string;
  contentHighlighted: boolean;
  wordHighlightStyle?: { backgroundColor: string; color: string };
  contentMuted?: boolean;
  showVerseBlurControls: boolean;
  verseRevealed: boolean;
  onRevealVerse: () => void;
  onHideVerse: () => void;
  revealVerseLabel: string;
  hideVerseLabel: string;
}

/** Shared content + verse layout so both card faces align when flipped. */
function FlashCardTextSlots({
  contentText,
  verseText,
  contentHighlighted,
  wordHighlightStyle,
  contentMuted,
  showVerseBlurControls,
  verseRevealed,
  onRevealVerse,
  onHideVerse,
  revealVerseLabel,
  hideVerseLabel,
}: FlashCardTextSlotsProps) {
  const contentVisible = Boolean(contentText.trim());
  const verseVisible = Boolean(verseText.trim());

  return (
    <div className={styles.flashFaceMain}>
      <p className={classNames(styles.flashContent, contentMuted && "opacity-75")}>
        <span
          className={classNames(
            contentHighlighted &&
              wordHighlightStyle &&
              styles.flashContentCoded,
            !contentVisible && styles.flashSlotEmpty,
          )}
          style={contentHighlighted ? wordHighlightStyle : undefined}
        >
          {contentVisible ? contentText : "\u00a0"}
        </span>
      </p>
      <div className={styles.flashVerseContext}>
        <div
          className={classNames(
            styles.flashVerseOverlay,
            showVerseBlurControls &&
              !verseRevealed &&
              styles.flashVerseOverlayBlurred,
            showVerseBlurControls &&
              verseRevealed &&
              styles.flashVerseOverlayRevealed,
          )}
        >
          <p
            className={classNames(
              styles.flashVerseContextText,
              showVerseBlurControls &&
                !verseRevealed &&
                styles.flashVerseContextBlurred,
              !verseVisible && styles.flashSlotEmpty,
            )}
            aria-hidden={showVerseBlurControls && !verseRevealed}
          >
            {verseVisible ? verseText : "\u00a0"}
          </p>
          {showVerseBlurControls && !verseRevealed ? (
            <button
              type="button"
              className={styles.flashRevealVerseOverlayBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRevealVerse();
              }}
              aria-label={revealVerseLabel}
            >
              <Eye size={22} strokeWidth={2} aria-hidden />
              <span className={styles.flashVerseOverlayTooltip}>
                {revealVerseLabel}
              </span>
            </button>
          ) : null}
          {showVerseBlurControls && verseRevealed ? (
            <button
              type="button"
              className={styles.flashHideVerseOverlayBtn}
              onClick={(e) => {
                e.stopPropagation();
                onHideVerse();
              }}
              aria-label={hideVerseLabel}
            >
              <EyeOff size={22} strokeWidth={2} aria-hidden />
              <span className={styles.flashVerseOverlayTooltip}>
                {hideVerseLabel}
              </span>
            </button>
          ) : null}
        </div>
        <div className={styles.flashRevealBtnSlot}>
          <span className={styles.flashRevealVerseBtn} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function VerseFlashcards({ lines }: { lines: VerseFlashcardLine[] }) {
  const { t } = useTranslation();
  const [cards, setCards] = useState<VerseFlashcardLine[]>(() => [...lines]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [verseContextRevealed, setVerseContextRevealed] = useState(false);

  const n = cards.length;
  const card = n > 0 ? cards[index] : null;

  useEffect(() => {
    setVerseContextRevealed(false);
  }, [index, card?.content, card?.verse]);

  const next = useCallback(() => {
    setFlipped(false);
    setVerseContextRevealed(false);
    setIndex((i) => (i + 1) % n);
  }, [n]);

  const prev = useCallback(() => {
    setFlipped(false);
    setVerseContextRevealed(false);
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const shuffle = useCallback(() => {
    setFlipped(false);
    setVerseContextRevealed(false);
    setCards((c) => shuffleArray(c));
    setIndex(0);
  }, []);

  const toggleFlip = useCallback(() => {
    setVerseContextRevealed(false);
    setFlipped((f) => !f);
  }, []);

  const onCardKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    },
    [toggleFlip],
  );

  if (n === 0 || !card) {
    return (
      <p className="text-body-secondary text-center mb-0">
        {t("songPage.flashcardsEmpty")}
      </p>
    );
  }

  const codeColor = flashCardCodeColor(card.code);
  const wordHighlightStyle = flashCardWordStyle(card.code);
  const showVerseContext =
    Boolean(card.content.trim()) &&
    Boolean(card.verse.trim()) &&
    card.content.trim() !== card.verse.trim();
  const showTranslationContext =
    Boolean(card.translation.trim()) &&
    Boolean(card.verseTranslation.trim()) &&
    card.translation.trim() !== card.verseTranslation.trim();
  const hasTranslation =
    Boolean(card.translation.trim()) || Boolean(card.verseTranslation.trim());

  const frontContentText = showVerseContext
    ? card.content
    : card.verse || card.content;
  const frontVerseText = showVerseContext ? card.verse : "";

  const backContentText = !hasTranslation
    ? t("songPage.noTranslation")
    : showTranslationContext
      ? card.translation
      : card.verseTranslation || card.translation;
  const backVerseText =
    hasTranslation && showTranslationContext ? card.verseTranslation : "";

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
              codeColor && !showVerseContext
                ? { borderTop: `3px solid ${codeColor}` }
                : undefined
            }
          >
            <span className={styles.flashFaceLabel}>
              {t("songPage.flashcardOriginal")}
            </span>
            <FlashCardTextSlots
              contentText={frontContentText}
              verseText={frontVerseText}
              contentHighlighted={showVerseContext}
              wordHighlightStyle={wordHighlightStyle}
              showVerseBlurControls={showVerseContext}
              verseRevealed={verseContextRevealed}
              onRevealVerse={() => setVerseContextRevealed(true)}
              onHideVerse={() => setVerseContextRevealed(false)}
              revealVerseLabel={t("songPage.flashcardRevealVerse")}
              hideVerseLabel={t("songPage.flashcardHideVerse")}
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
              contentText={backContentText}
              verseText={backVerseText}
              contentHighlighted={showTranslationContext}
              wordHighlightStyle={wordHighlightStyle}
              contentMuted={!hasTranslation}
              showVerseBlurControls={false}
              verseRevealed={false}
              onRevealVerse={() => {}}
              onHideVerse={() => {}}
              revealVerseLabel={t("songPage.flashcardRevealVerse")}
              hideVerseLabel={t("songPage.flashcardHideVerse")}
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

export function SongLearnTabs({
  children,
  verseLines,
  glossaryTabClassName,
}: {
  children: ReactNode;
  verseLines: VerseFlashcardLine[];
  glossaryTabClassName?: string;
}) {
  const { t } = useTranslation();

  const lines = useMemo(
    () =>
      verseLines.filter(
        (l) =>
          l.content.trim() ||
          l.verse.trim() ||
          l.translation.trim() ||
          l.verseTranslation.trim(),
      ),
    [verseLines],
  );

  return (
    <Tabs
      defaultActiveKey="glossary"
      id="song-learn-tabs"
      className="justify-content-center mb-0"
      justify
    >
      <Tab eventKey="glossary" title={t("songPage.glossaryHeading")}>
        <div
          className={classNames(
            "text-body text-start pt-3",
            glossaryStyles.glossary,
            glossaryTabClassName,
          )}
        >
          {children}
        </div>
      </Tab>
      <Tab eventKey="flashcard" title={t("songPage.tabFlashcard")}>
        <div className="pt-3">
          <VerseFlashcards lines={lines} />
        </div>
      </Tab>
    </Tabs>
  );
}
