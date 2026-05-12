"use client";

import classNames from "classnames";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
} from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import glossaryStyles from "./SongDetailView.module.scss";
import styles from "./SongLearnTabs.module.scss";

export interface VerseFlashcardLine {
  original: string;
  translation: string;
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

  const n = cards.length;
  const card = n > 0 ? cards[index] : null;

  const next = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i + 1) % n);
  }, [n]);

  const prev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const shuffle = useCallback(() => {
    setFlipped(false);
    setCards((c) => shuffleArray(c));
    setIndex(0);
  }, []);

  const toggleFlip = useCallback(() => {
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

  const backText = card.translation.trim()
    ? card.translation
    : t("songPage.noTranslation");

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
          <div className={styles.flashFace}>
            <span className={styles.flashFaceLabel}>
              {t("songPage.flashcardOriginal")}
            </span>
            <p className={styles.flashFaceText}>{card.original}</p>
            <span className={styles.flashHint}>
              {t("songPage.flashcardClickToReveal")}
            </span>
          </div>
          <div className={classNames(styles.flashFace, styles.flashFaceBack)}>
            <span className={styles.flashFaceLabel}>
              {t("songPage.flashcardTranslation")}
            </span>
            <p
              className={classNames(
                styles.flashFaceText,
                !card.translation.trim() && "opacity-75",
              )}
            >
              {backText}
            </p>
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
        (l) => l.original.trim() || l.translation.trim(),
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
