"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import type { FlashcardLine } from "@/entities/youtube-release";
import { filterNonEmptyFlashcardLines } from "./flashcards/flashcards-utils";
import { Flashcards } from "./flashcards";
import { Glossary } from "./glossary";

export function SongLearnTabs({
  glossary,
  verseLines,
}: {
  glossary: string | null;
  verseLines: FlashcardLine[];
}) {
  const { t } = useTranslation();

  const lines = useMemo(
    () => filterNonEmptyFlashcardLines(verseLines),
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
        <Glossary content={glossary} />
      </Tab>
      <Tab eventKey="flashcard" title={t("songPage.tabFlashcard")}>
        <div className="pt-3">
          <Flashcards lines={lines} />
        </div>
      </Tab>
    </Tabs>
  );
}
