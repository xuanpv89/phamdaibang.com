"use client";

import Link from "next/link";
import React from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card } from "@/app/components/card";
import { Navigation } from "@/app/components/nav";
import { useLanguage } from "@/app/components/language";
import { sitePath } from "@/app/components/site-paths";
import {
  portfolioProjects,
  portfolioUrl,
  projectDetailCopy,
} from "../portfolio-data";

export function ProjectDetailClient({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const text = projectDetailCopy[language];
  const project = portfolioProjects[language].find((item) => item.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-zinc-100">
        <Navigation />
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-bold font-display">
            {text.missingTitle}
          </h1>
          <p className="mt-4 text-zinc-400">{text.missingBody}</p>
          <Link href={sitePath(language, "/projects")} className="mt-8 text-sm text-zinc-300 hover:text-white">
            {text.back}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-16 text-zinc-100">
      <Navigation />
      <main className="mx-auto max-w-5xl px-6 pt-24 lg:px-8 lg:pt-32">
        <Link
          href={sitePath(language, "/projects")}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 duration-200 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {text.back}
        </Link>

        <header className="mt-10 border-b border-zinc-800 pb-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            {project.meta}
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            {project.description}
          </p>
          <Link
            href={portfolioUrl}
            target="_blank"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 duration-200 hover:text-white"
          >
            {text.portfolio}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card>
            <section className="h-full p-5 md:p-6">
              <h2 className="text-xl font-semibold text-white">{text.scope}</h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-zinc-300">
                {project.scope.map((item) => (
                  <li key={item} className="border-l border-zinc-700 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </Card>

          <Card>
            <section className="h-full p-5 md:p-6">
              <h2 className="text-xl font-semibold text-white">{text.results}</h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-zinc-300">
                {project.results.map((item) => (
                  <li key={item} className="border-l border-zinc-700 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </Card>

          <Card>
            <section className="h-full p-5 md:p-6">
              <h2 className="text-xl font-semibold text-white">{text.related}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.related.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          </Card>
        </div>
      </main>
    </div>
  );
}
