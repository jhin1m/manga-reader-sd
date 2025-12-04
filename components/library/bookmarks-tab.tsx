"use client";

import { useTranslations } from "next-intl";

export function BookmarksTab() {
  const t = useTranslations("user.library.tabs");
  return <div>{t("bookmarks")} - TODO (Phase 3)</div>;
}
