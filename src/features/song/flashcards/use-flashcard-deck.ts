import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import type { FlashcardLine } from "@/entities/youtube-release";
import { shuffleArray } from "./flashcards-utils";

export function useFlashcardDeck(lines: FlashcardLine[]) {
  const [cards, setCards] = useState<FlashcardLine[]>(() => [...lines]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [frontVerseRevealed, setFrontVerseRevealed] = useState(false);

  const n = cards.length;
  const card = n > 0 ? cards[index] : null;

  useEffect(() => {
    setFrontVerseRevealed(false);
  }, [index, card?.content, card?.verse]);

  const next = useCallback(() => {
    setFlipped(false);
    setFrontVerseRevealed(false);
    setIndex((i) => (i + 1) % n);
  }, [n]);

  const prev = useCallback(() => {
    setFlipped(false);
    setFrontVerseRevealed(false);
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const shuffle = useCallback(() => {
    setFlipped(false);
    setFrontVerseRevealed(false);
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

  return {
    card,
    n,
    index,
    flipped,
    frontVerseRevealed,
    setFrontVerseRevealed,
    next,
    prev,
    shuffle,
    toggleFlip,
    onCardKeyDown,
  };
}
