import type { UpdateProfileRequest, User } from "@/entities/user";
import {
  GERMAN_LEVEL_OPTIONS,
  HOW_FOUND_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
  PRESET_LANGUAGE_VALUES,
} from "@/entities/user";

export type ProfileFormValues = Pick<
  User,
  "howFound" | "germanLevel" | "country" | "language" | "goals"
>;

export type ProfileFormSource = ProfileFormValues & {
  name?: string | null;
};

export interface ProfileFieldsFormValues {
  name?: string;
  howFound: string;
  germanLevel: string;
  country: string;
  language: string;
  languageOther: string;
  goals: string;
}

const PRESET_LANGUAGE_SET = new Set<string>(PRESET_LANGUAGE_VALUES);

export function profileToFormValues(
  user: ProfileFormSource,
  options?: { includeName?: boolean },
): ProfileFieldsFormValues {
  const storedLanguage = user.language ?? "";
  const isPresetLanguage = PRESET_LANGUAGE_SET.has(storedLanguage);

  const values: ProfileFieldsFormValues = {
    howFound: user.howFound ?? "",
    germanLevel: user.germanLevel ?? "",
    country: user.country ?? "",
    language: isPresetLanguage
      ? storedLanguage
      : storedLanguage
        ? "other"
        : "",
    languageOther: isPresetLanguage ? "" : storedLanguage,
    goals: user.goals ?? "",
  };

  if (options?.includeName) {
    values.name = user.name ?? "";
  }

  return values;
}

export function buildProfilePatch(
  values: ProfileFieldsFormValues,
  initial?: ProfileFormSource,
  options?: { includeName?: boolean },
): UpdateProfileRequest {
  const patch: UpdateProfileRequest = {};

  if (options?.includeName && values.name !== undefined) {
    const trimmed = values.name.trim();
    const initialName = (initial?.name ?? "").trim();
    if (trimmed !== initialName) {
      patch.name = trimmed || null;
    }
  }

  if (values.howFound.trim()) {
    patch.howFound = values.howFound.trim();
  }
  if (values.germanLevel.trim()) {
    patch.germanLevel = values.germanLevel.trim();
  }
  if (values.country.trim()) {
    patch.country = values.country.trim();
  }

  if (values.language.trim()) {
    if (values.language === "other") {
      if (values.languageOther.trim()) {
        patch.language = values.languageOther.trim();
      }
    } else {
      patch.language = values.language.trim();
    }
  }

  if (values.goals.trim()) {
    patch.goals = values.goals.trim();
  }

  return patch;
}

export {
  GERMAN_LEVEL_OPTIONS,
  HOW_FOUND_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
};
