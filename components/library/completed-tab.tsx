"use client";

import { useTranslations } from "next-intl";

export function CompletedTab() {
  const t = useTranslations("user.library.tabs");
  return <div>{t("completed")} - TODO (Phase 3)</div>;
}
