import type { FlashcardLine } from "@/entities/youtube-release";

export function shuffleArray<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

export function filterNonEmptyFlashcardLines(
  lines: FlashcardLine[],
): FlashcardLine[] {
  return lines.filter(
    (l) =>
      l.content.trim() ||
      l.verse.trim() ||
      l.translation.trim() ||
      l.verseTranslation.trim(),
  );
}

export function mapFlashcardFaces(
  card: FlashcardLine,
  labels: { noTranslation: string },
) {
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
    ? labels.noTranslation
    : showTranslationContext
      ? card.translation
      : card.verseTranslation || card.translation;
  const backVerseText =
    hasTranslation && showTranslationContext ? card.verseTranslation : "";

  return {
    showVerseContext,
    showTranslationContext,
    hasTranslation,
    frontContentText,
    frontVerseText,
    backContentText,
    backVerseText,
  };
}
