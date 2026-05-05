"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const storageKey = "phamdaibang-language";
const defaultLanguage = "en";

function getSavedLanguage() {
  if (typeof window === "undefined") return defaultLanguage;

  const saved = window.localStorage.getItem(storageKey);
  return saved === "vi" || saved === "en" ? saved : defaultLanguage;
}

export function BlogLanguageRedirect({ slug }: { slug?: string }) {
  const router = useRouter();

  useEffect(() => {
    const language = getSavedLanguage();
    const query = window.location.search;
    const path = `/${language}/blog${slug ? `/${slug}` : ""}${query}`;

    router.replace(path);
  }, [router, slug]);

  return null;
}
