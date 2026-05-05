"use client";

import Link from "next/link";
import React from "react";
import { LanguagePicker, useLanguage } from "./language";
import { blogPath, sitePath } from "./site-paths";
import Particles from "./particles";

type NavigationItem =
  | { name: string; href: string; path?: never }
  | { name: string; path: string; href?: never };

const copy: Record<
  "vi" | "en",
  {
    navigation: NavigationItem[];
    taglineBefore: string;
    taglineLink: string;
    taglineAfter: string;
  }
> = {
  vi: {
    navigation: [
      { name: "Bài viết", path: "/blog" },
      { name: "Công việc", href: "https://www.folksteam.com" },
      { name: "Portfolio", href: "https://cv.phamdaibang.com" },
      { name: "Giới thiệu", path: "/about" },
      { name: "Dự án", path: "/projects" },
      { name: "Liên hệ", path: "/contact" },
    ],
    taglineBefore: "Một hạt",
    taglineLink: "bụi",
    taglineAfter: "nhỏ trôi giữa vũ trụ.",
  },
  en: {
    navigation: [
      { name: "My Blog", path: "/blog" },
      { name: "My Work", href: "https://www.folksteam.com" },
      { name: "My Portfolio", href: "https://cv.phamdaibang.com" },
      { name: "About", path: "/about" },
      { name: "Projects", path: "/projects" },
      { name: "Contact", path: "/contact" },
    ],
    taglineBefore: "A tiny speck of",
    taglineLink: "dust",
    taglineAfter: "floating through the universe.",
  },
};

export default function HomePage() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <LanguagePicker className="absolute right-6 top-6 z-20 animate-fade-in" />
      <nav className="my-16 px-5 animate-fade-in">
        <ul className="flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-5">
          {text.navigation.map((item) => {
            const href = item.href ?? sitePath(language, item.path);

            return (
              <Link
                key={href}
                href={href}
                className="text-[15px] leading-6 text-zinc-500 duration-500 hover:text-zinc-300 sm:text-base"
              >
                {item.name}
              </Link>
            );
          })}
        </ul>
      </nav>
      <div className="hidden h-px w-screen animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
      />
      <h1 className="text-edge-outline z-10 cursor-default whitespace-nowrap bg-white bg-clip-text px-0.5 py-3.5 text-4xl text-transparent duration-1000 animate-title font-display sm:text-6xl md:text-6xl">
        phamdaibang
      </h1>

      <div className="hidden h-px w-screen animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-sm text-zinc-500">
          {text.taglineBefore}{" "}
          <Link
            href={blogPath(language)}
            className="underline duration-500 hover:text-zinc-300"
          >
            {text.taglineLink}
          </Link>{" "}
          {text.taglineAfter}
        </h2>
      </div>
    </div>
  );
}
