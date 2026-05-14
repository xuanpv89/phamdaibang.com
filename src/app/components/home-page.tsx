"use client";

import {
  ArrowUpRight,
  BookOpenText,
  BriefcaseBusiness,
  FolderKanban,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { LanguagePicker, useLanguage } from "./language";
import Particles from "./particles";
import { blogPath, sitePath } from "./site-paths";

type NavigationItem =
  | { name: string; href: string; path?: never }
  | { name: string; path: string; href?: never };

const copy: Record<
  "vi" | "en",
  {
    navigation: NavigationItem[];
    eyebrow: string;
    title: string;
    intro: string;
    primary: string;
    secondary: string;
    portraitLabel: string;
    stats: { value: string; label: string }[];
    quickLinks: {
      name: string;
      description: string;
      path?: string;
      href?: string;
      icon: React.ComponentType<{ className?: string }>;
    }[];
  }
> = {
  vi: {
    navigation: [
      { name: "Bài viết", path: "/blog" },
      { name: "Công việc", href: "https://www.folksteam.com" },
      { name: "Portfolio", href: "https://portfolio.phamdaibang.com/" },
      { name: "Giới thiệu", path: "/about" },
      { name: "Dự án", path: "/projects" },
      { name: "Liên hệ", path: "/contact" },
    ],
    eyebrow: "Pham Dai Bang",
    title: "Một góc viết, làm việc và quan sát đời sống.",
    intro:
      "Không gian cá nhân của Phạm Đại Bàng: blog, portfolio, dự án cộng đồng, truyền thông, phát triển con người và những ghi chép chậm rãi.",
    primary: "Đọc blog",
    secondary: "Xem portfolio",
    portraitLabel: "Communication, writing, community, human development",
    stats: [
      { value: "10+", label: "năm kinh nghiệm" },
      { value: "50+", label: "sự kiện và chương trình" },
      { value: "100k+", label: "lượt đọc và tiếp cận" },
    ],
    quickLinks: [
      {
        name: "Blog",
        description: "Essay, fiction, thơ, ghi chú và các mảnh suy tư.",
        path: "/blog",
        icon: BookOpenText,
      },
      {
        name: "Dự án",
        description: "Portfolio công việc, cộng đồng, nội dung và đào tạo.",
        path: "/projects",
        icon: FolderKanban,
      },
      {
        name: "Công việc",
        description: "FOLKS và các hoạt động business/community hiện tại.",
        href: "https://www.folksteam.com",
        icon: BriefcaseBusiness,
      },
      {
        name: "Liên hệ",
        description: "Kết nối cho hợp tác, trao đổi và dự án mới.",
        path: "/contact",
        icon: Mail,
      },
    ],
  },
  en: {
    navigation: [
      { name: "Blog", path: "/blog" },
      { name: "Work", href: "https://www.folksteam.com" },
      { name: "Portfolio", href: "https://portfolio.phamdaibang.com/" },
      { name: "About", path: "/about" },
      { name: "Projects", path: "/projects" },
      { name: "Contact", path: "/contact" },
    ],
    eyebrow: "Pham Dai Bang",
    title: "A writing room for work, people, and everyday reflection.",
    intro:
      "The personal space of Pham Dai Bang: blog, portfolio, community projects, communication, human development, and slower notes from lived experience.",
    primary: "Read the blog",
    secondary: "View portfolio",
    portraitLabel: "Communication, writing, community, human development",
    stats: [
      { value: "10+", label: "years of experience" },
      { value: "50+", label: "events and programs" },
      { value: "100k+", label: "readers and reach" },
    ],
    quickLinks: [
      {
        name: "Blog",
        description: "Essays, fiction, poetry, notes, and reflective fragments.",
        path: "/blog",
        icon: BookOpenText,
      },
      {
        name: "Projects",
        description: "Work, community, content, and learning portfolio.",
        path: "/projects",
        icon: FolderKanban,
      },
      {
        name: "Work",
        description: "FOLKS and current business/community initiatives.",
        href: "https://www.folksteam.com",
        icon: BriefcaseBusiness,
      },
      {
        name: "Contact",
        description: "Start a conversation, collaboration, or new project.",
        path: "/contact",
        icon: Mail,
      },
    ],
  },
};

function itemHref(language: "vi" | "en", item: NavigationItem) {
  return item.href ?? sitePath(language, item.path);
}

export default function HomePage() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080807] text-zinc-100">
      <Particles
        className="pointer-events-none absolute inset-0 opacity-35"
        quantity={80}
        staticity={70}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,8,7,0.96)_0%,rgba(20,20,18,0.9)_42%,rgba(58,54,48,0.5)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:px-8">
        <header className="flex items-center justify-between gap-6">
          <Link
            href={sitePath(language, "/")}
            className="font-display text-xl font-bold text-white"
          >
            phamdaibang
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {text.navigation.map((item) => {
              const href = itemHref(language, item);

              return (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-medium text-zinc-400 duration-200 hover:text-white"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <LanguagePicker className="shrink-0" />
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-200/80">
              {text.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] text-white font-display sm:text-6xl lg:text-7xl">
              {text.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              {text.intro}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={blogPath(language)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 duration-200 hover:bg-amber-100"
              >
                {text.primary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://portfolio.phamdaibang.com/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white duration-200 hover:border-amber-200/70 hover:text-amber-100"
              >
                {text.secondary}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {text.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-bold text-white font-display">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-5 text-zinc-400 sm:text-sm">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50">
              <Image
                src="/images/phamdaibang2026.webp"
                alt="Pham Dai Bang speaking on stage"
                width={960}
                height={1200}
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="aspect-[4/5] w-full object-cover object-[50%_28%] opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-100/80">
                  {text.portraitLabel}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 pb-6 sm:grid-cols-2 lg:grid-cols-4">
          {text.quickLinks.map((item) => {
            const Icon = item.icon;
            const href = item.href ?? sitePath(language, item.path ?? "/");

            return (
              <Link
                key={item.name}
                href={href}
                className="group rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur duration-200 hover:border-amber-200/50 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-4">
                  <Icon className="h-5 w-5 text-amber-100/80" />
                  <ArrowUpRight className="h-4 w-4 text-zinc-500 duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-100" />
                </div>
                <h2 className="mt-5 text-base font-semibold text-white">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
