"use client";

import classNames from "classnames";
import styles from "./Flashcards.module.scss";

interface FlashCardTextSlotsProps {
  contentText: string;
  verseText: string;
  contentHighlighted: boolean;
  wordHighlightStyle?: { backgroundColor: string; color: string };
  contentMuted?: boolean;
}

/** Shared content + verse layout so both card faces align when flipped. */
export function FlashCardTextSlots({
  contentText,
  verseText,
  contentHighlighted,
  wordHighlightStyle,
  contentMuted,
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
        <div className={styles.flashVerseOverlay}>
          <p
            className={classNames(
              styles.flashVerseContextText,
              !verseVisible && styles.flashSlotEmpty,
            )}
          >
            {verseVisible ? verseText : "\u00a0"}
          </p>
        </div>
      </div>
    </div>
  );
}
