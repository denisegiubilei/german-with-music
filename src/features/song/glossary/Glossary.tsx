"use client";

import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import styles from "./Glossary.module.scss";

export function Glossary({
  content,
  className,
}: {
  content: string | null;
  className?: string;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        styles.root,
        "text-body text-start pt-3",
        className,
      )}
    >
      {content ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      ) : (
        <p className="text-body-secondary mb-0">{t("songPage.noGlossary")}</p>
      )}
    </div>
  );
}
