"use client";

import classNames from "classnames";
import { Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import styles from "./LibraryFiltersPanel.module.scss";

const MD_MIN_PX = 768;

export function LibraryFiltersPanel({
  formAction,
  defaultArtist,
  defaultTitle,
}: {
  formAction: string;
  defaultArtist: string;
  defaultTitle: string;
}) {
  const { t } = useTranslation();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const hasActiveFilters = Boolean(
    defaultArtist?.trim() || defaultTitle?.trim(),
  );

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;

    const mq = window.matchMedia(`(min-width: ${MD_MIN_PX}px)`);
    const sync = () => {
      if (mq.matches) {
        el.open = true;
      } else {
        el.open = hasActiveFilters;
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [hasActiveFilters]);

  return (
    <details
      ref={detailsRef}
      className={classNames(
        "border rounded-3 mb-4 bg-body-secondary overflow-hidden",
        styles.details,
      )}
    >
      <summary
        className={classNames(
          "d-md-none d-flex w-100 align-items-center gap-2",
          styles.summary,
        )}
      >
        <Filter size={16} strokeWidth={2} className="flex-shrink-0" aria-hidden />
        {t("library.toggleFilters")}
      </summary>
      <div className="p-3 p-md-4">
        <Form method="get" action={formAction} className="mb-0">
          <Row className="g-3 align-items-stretch">
            <Col xs={12} md={4}>
              <FloatingLabel
                controlId="library-filter-artist"
                label={t("library.filterArtist")}
              >
                <Form.Control
                  name="artist"
                  type="search"
                  placeholder={t("library.filterArtist")}
                  defaultValue={defaultArtist}
                  autoComplete="off"
                />
              </FloatingLabel>
            </Col>
            <Col xs={12} md={4}>
              <FloatingLabel
                controlId="library-filter-title"
                label={t("library.filterTitle")}
              >
                <Form.Control
                  name="title"
                  type="search"
                  placeholder={t("library.filterTitle")}
                  defaultValue={defaultTitle}
                  autoComplete="off"
                />
              </FloatingLabel>
            </Col>
            <Col
              xs={12}
              md={4}
              className="d-flex flex-wrap gap-2 justify-content-end align-items-center"
            >
              <Button type="submit" variant="warning" className="text-dark">
                {t("library.applyFilters")}
              </Button>
              <Link href={formAction} className="btn btn-outline-secondary">
                {t("library.clearFilters")}
              </Link>
            </Col>
          </Row>
        </Form>
      </div>
    </details>
  );
}
