import type { Locale } from "@/lib/i18n";

export function getBlogIndexPath(locale: Locale) {
  return `/${locale}/blog`;
}

export function getBlogPostPath(locale: Locale, slug: string) {
  return `/${locale}/blog/${slug}`;
}

export function getBlogTagIndexPath(locale: Locale) {
  return `/${locale}/tag`;
}

export function getBlogTagPath(locale: Locale, tag: string) {
  return `/${locale}/tag/${tag}`;
}
