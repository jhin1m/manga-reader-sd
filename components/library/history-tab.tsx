"use client";

import { useTranslations } from "next-intl";

export function HistoryTab() {
  const t = useTranslations("user.library.tabs");
  return <div>{t("history")} - TODO (Phase 3)</div>;
}
