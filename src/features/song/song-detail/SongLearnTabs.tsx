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
import { flashCardCodeColor } from "@/entities/youtube-release";
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
            <div className={styles.flashFaceMain}>
              <p
                className={styles.flashContent}
                style={codeColor ? { color: codeColor } : undefined}
              >
                {showVerseContext ? card.content : card.verse || card.content}
              </p>
              <div className={styles.flashVerseContext}>
                <div
                  className={classNames(
                    styles.flashVerseOverlay,
                    showVerseContext &&
                      !verseContextRevealed &&
                      styles.flashVerseOverlayBlurred,
                    showVerseContext &&
                      verseContextRevealed &&
                      styles.flashVerseOverlayRevealed,
                  )}
                >
                  <p
                    className={classNames(
                      styles.flashVerseContextText,
                      showVerseContext &&
                        !verseContextRevealed &&
                        styles.flashVerseContextBlurred,
                    )}
                    aria-hidden={showVerseContext && !verseContextRevealed}
                  >
                    {showVerseContext ? card.verse : "\u00a0"}
                  </p>
                  {showVerseContext && !verseContextRevealed ? (
                    <button
                      type="button"
                      className={styles.flashRevealVerseOverlayBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setVerseContextRevealed(true);
                      }}
                      aria-label={t("songPage.flashcardRevealVerse")}
                    >
                      <Eye size={22} strokeWidth={2} aria-hidden />
                      <span className={styles.flashVerseOverlayTooltip}>
                        {t("songPage.flashcardRevealVerse")}
                      </span>
                    </button>
                  ) : null}
                  {showVerseContext && verseContextRevealed ? (
                    <button
                      type="button"
                      className={styles.flashHideVerseOverlayBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setVerseContextRevealed(false);
                      }}
                      aria-label={t("songPage.flashcardHideVerse")}
                    >
                      <EyeOff size={22} strokeWidth={2} aria-hidden />
                      <span className={styles.flashVerseOverlayTooltip}>
                        {t("songPage.flashcardHideVerse")}
                      </span>
                    </button>
                  ) : null}
                </div>
                <div className={styles.flashRevealBtnSlot}>
                  <span className={styles.flashRevealVerseBtn} aria-hidden />
                </div>
              </div>
            </div>
            <span className={styles.flashHint}>
              {t("songPage.flashcardClickToReveal")}
            </span>
          </div>
          <div className={classNames(styles.flashFace, styles.flashFaceBack)}>
            <span className={styles.flashFaceLabel}>
              {t("songPage.flashcardTranslation")}
            </span>
            <div className={styles.flashFaceMain}>
              <p
                className={classNames(
                  styles.flashContent,
                  !hasTranslation && "opacity-75",
                )}
                style={
                  hasTranslation && codeColor
                    ? { color: codeColor }
                    : undefined
                }
              >
                {!hasTranslation
                  ? t("songPage.noTranslation")
                  : showTranslationContext
                    ? card.translation
                    : card.verseTranslation || card.translation}
              </p>
              <div className={styles.flashVerseContext}>
                <p className={styles.flashVerseContextText}>
                  {hasTranslation && showTranslationContext
                    ? card.verseTranslation
                    : "\u00a0"}
                </p>
                <div className={styles.flashRevealBtnSlot}>
                  <span className={styles.flashRevealVerseBtn} aria-hidden />
                </div>
              </div>
            </div>
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
