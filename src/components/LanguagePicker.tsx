"use client";

import { localeLabels, locales, type Locale } from "@/lib/i18n";
import type { AlternatePostPaths } from "@/lib/post-translations";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function localizedCurrentPath(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (locales.includes(segments[0] as Locale)) {
    segments[0] = locale;
    return `/${segments.join("/")}`;
  }

  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

export function LanguagePicker({
  currentLocale,
  alternatePaths,
}: {
  currentLocale: Locale;
  alternatePaths?: AlternatePostPaths;
}) {
  const pathname = usePathname();

  return (
    <div
      aria-label={currentLocale === "vi" ? "Chọn ngôn ngữ" : "Choose language"}
      className="inline-flex items-center rounded-md border bg-background p-1 text-sm"
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;
        const href =
          alternatePaths?.[locale] ?? localizedCurrentPath(pathname, locale);

        return (
          <Link
            key={locale}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded px-2.5 py-1 font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
