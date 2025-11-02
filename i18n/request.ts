import { getRequestConfig } from "next-intl/server";

/**
 * i18n Request Configuration
 *
 * This configuration is called once per request and provides the messages
 * for the current locale to Server Components.
 *
 * Currently configured with Vietnamese (vi) as the default locale.
 * To add more locales in the future, replace the hardcoded locale
 * with dynamic locale detection.
 *
 * Usage in Server Components:
 * ```tsx
 * import { useTranslations } from 'next-intl';
 *
 * export default function Page() {
 *   const t = useTranslations('common');
 *   return <h1>{t('welcome')}</h1>;
 * }
 * ```
 */
export default getRequestConfig(async () => {
  // Default locale is Vietnamese (vi)
  // In the future, this can be made dynamic:
  // - From URL parameter (e.g., /vi/home, /en/home)
  // - From cookies (user preference)
  // - From browser Accept-Language header
  const locale = "vi";

  return {
    locale,
    // Dynamically import messages for the current locale
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
