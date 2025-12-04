"use client";

import { useTranslations } from "next-intl";

export function ContinueReadingSection() {
  const t = useTranslations("user.library.tabs");
  return <div>{t("continue")} - TODO (Phase 3)</div>;
}
