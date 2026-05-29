export const HOW_FOUND_OPTIONS = [
  "tiktok",
  "youtube",
  "instagram",
  "other",
] as const;

export type HowFoundOption = (typeof HOW_FOUND_OPTIONS)[number];

export const GERMAN_LEVEL_OPTIONS = [
  "complete_beginner",
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "c2",
  "not_sure",
] as const;

export type GermanLevelOption = (typeof GERMAN_LEVEL_OPTIONS)[number];

export const PREFERRED_LANGUAGE_OPTIONS = [
  "english",
  "portuguese",
  "spanish",
  "other",
] as const;

export type PreferredLanguageOption =
  (typeof PREFERRED_LANGUAGE_OPTIONS)[number];

export const PRESET_LANGUAGE_VALUES = PREFERRED_LANGUAGE_OPTIONS.filter(
  (option): option is Exclude<PreferredLanguageOption, "other"> =>
    option !== "other",
);
