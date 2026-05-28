"use client";

import classNames from "classnames";
import { Eye, EyeOff } from "lucide-react";
import styles from "./Flashcards.module.scss";

interface FlashCardTextSlotsProps {
  contentText: string;
  verseText: string;
  contentHighlighted: boolean;
  wordHighlightStyle?: { backgroundColor: string; color: string };
  contentMuted?: boolean;
  verseRevealMode: "interactive" | "always-visible";
  verseRevealed: boolean;
  onRevealVerse: () => void;
  onHideVerse: () => void;
  revealVerseLabel: string;
  hideVerseLabel: string;
}

/** Shared content + verse layout so both card faces align when flipped. */
export function FlashCardTextSlots({
  contentText,
  verseText,
  contentHighlighted,
  wordHighlightStyle,
  contentMuted,
  verseRevealMode,
  verseRevealed,
  onRevealVerse,
  onHideVerse,
  revealVerseLabel,
  hideVerseLabel,
}: FlashCardTextSlotsProps) {
  const showVerseBlurControls = verseRevealMode === "interactive";
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
