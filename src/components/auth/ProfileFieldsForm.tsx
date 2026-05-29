"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import type { UpdateProfileRequest, User } from "@/entities/user";
import {
  buildProfilePatch,
  GERMAN_LEVEL_OPTIONS,
  HOW_FOUND_OPTIONS,
  PREFERRED_LANGUAGE_OPTIONS,
  profileToFormValues,
  type ProfileFieldsFormValues,
} from "./profile-form-utils";

interface ProfileFieldsFormProps {
  initialValues: Pick<
    User,
    "howFound" | "germanLevel" | "country" | "language" | "goals"
  > &
    Partial<Pick<User, "name">>;
  onSubmit: (patch: UpdateProfileRequest) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  includeName?: boolean;
}

export function ProfileFieldsForm({
  initialValues,
  onSubmit,
  submitLabel,
  submittingLabel,
  isSubmitting,
  includeName = false,
}: ProfileFieldsFormProps) {
  const { t } = useTranslation("common");
  const { register, handleSubmit, reset, watch } =
    useForm<ProfileFieldsFormValues>({
      defaultValues: profileToFormValues(initialValues, { includeName }),
    });

  const selectedLanguage = watch("language");

  useEffect(() => {
    reset(profileToFormValues(initialValues, { includeName }));
  }, [initialValues, includeName, reset]);

  const onFormSubmit = handleSubmit(async (values) => {
    await onSubmit(
      buildProfilePatch(values, initialValues, { includeName }),
    );
  });

  return (
    <Form onSubmit={onFormSubmit} noValidate>
      {includeName && (
        <Form.Group className="mb-3" controlId="profile-name">
          <Form.Label>{t("auth.me.nameLabel")}</Form.Label>
          <Form.Control
            type="text"
            autoComplete="name"
            placeholder={t("auth.signUp.namePlaceholder")}
            disabled={isSubmitting}
            {...register("name")}
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3" controlId="profile-howFound">
        <Form.Label>{t("auth.profile.howFoundLabel")}</Form.Label>
        <Form.Select disabled={isSubmitting} {...register("howFound")}>
          <option value="">{t("auth.profile.howFoundPlaceholder")}</option>
          {HOW_FOUND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`auth.profile.howFound.${option}`)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="profile-germanLevel">
        <Form.Label>{t("auth.profile.germanLevelLabel")}</Form.Label>
        <Form.Select disabled={isSubmitting} {...register("germanLevel")}>
          <option value="">{t("auth.profile.germanLevelPlaceholder")}</option>
          {GERMAN_LEVEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`auth.profile.germanLevel.${option}`)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="profile-country">
        <Form.Label>{t("auth.profile.countryLabel")}</Form.Label>
        <Form.Control
          type="text"
          autoComplete="country-name"
          placeholder={t("auth.profile.countryPlaceholder")}
          disabled={isSubmitting}
          {...register("country")}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="profile-language">
        <Form.Label>{t("auth.profile.languageLabel")}</Form.Label>
        <Form.Select disabled={isSubmitting} {...register("language")}>
          <option value="">{t("auth.profile.languagePlaceholder")}</option>
          {PREFERRED_LANGUAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`auth.profile.language.${option}`)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {selectedLanguage === "other" && (
        <Form.Group className="mb-3" controlId="profile-languageOther">
          <Form.Label className="visually-hidden">
            {t("auth.profile.languageOtherLabel")}
          </Form.Label>
          <Form.Control
            type="text"
            autoComplete="off"
            placeholder={t("auth.profile.languageOtherPlaceholder")}
            disabled={isSubmitting}
            {...register("languageOther")}
          />
        </Form.Group>
      )}

      <Form.Group className="mb-4" controlId="profile-goals">
        <Form.Label>{t("auth.profile.goalsLabel")}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder={t("auth.profile.goalsPlaceholder")}
          disabled={isSubmitting}
          {...register("goals")}
        />
      </Form.Group>

      <Button
        type="submit"
        variant="warning"
        className="w-100 text-dark border-0"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" className="me-2" aria-hidden />
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </Form>
  );
}
