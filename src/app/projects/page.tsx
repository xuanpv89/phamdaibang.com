"use client";

import Link from "next/link";
import React from "react";
import { Briefcase, ExternalLink } from "lucide-react";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { useLanguage } from "../components/language";
import { sitePath } from "../components/site-paths";
import { portfolioProjects, portfolioUrl, projectsCopy } from "./portfolio-data";

export default function ProjectsPage() {
	const { language } = useLanguage();
	const text = projectsCopy[language];
	const [featured, ...items] = portfolioProjects[language];

	return (
		<div className="relative pb-16">
			<Navigation />
			<div className="px-6 pt-24 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-12 lg:pt-32">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl">
						<p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
							{text.eyebrow}
						</p>
						<h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
							{text.title}
						</h2>
						<p className="mt-4 text-zinc-400 leading-7">{text.intro}</p>
					</div>
					<Link
						href={portfolioUrl}
						target="_blank"
						className="inline-flex items-center gap-2 text-sm font-medium duration-200 text-zinc-300 hover:text-white"
					>
						{text.openPortfolio}
						<ExternalLink className="h-4 w-4" />
					</Link>
				</div>

				<div className="w-full h-px bg-zinc-800" />

				<Card>
					<Link href={sitePath(language, `/projects/${featured.slug}`)} className="block">
						<article className="relative p-5 md:p-8">
							<div className="flex items-center gap-3 text-sm text-zinc-500">
								<Briefcase className="h-4 w-4" />
								<span>{featured.meta}</span>
							</div>
							<h3 className="mt-5 text-3xl font-bold text-zinc-100 sm:text-4xl font-display">
								{featured.title}
							</h3>
							<p className="mt-4 max-w-3xl leading-8 text-zinc-400">
								{featured.description}
							</p>
							<ul className="mt-6 grid gap-3 text-sm leading-6 text-zinc-300 md:grid-cols-3">
								{featured.points.map((point) => (
									<li key={point} className="border-l border-zinc-700 pl-4">
										{point}
									</li>
								))}
							</ul>
							<p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-300">
								{text.readMore}
								<ExternalLink className="h-4 w-4" />
							</p>
						</article>
					</Link>
				</Card>

				<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
					{items.map((item) => (
						<Card key={item.title}>
							<Link href={sitePath(language, `/projects/${item.slug}`)} className="block h-full">
								<article className="flex h-full flex-col p-5 md:p-6">
									<p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
										{item.meta}
									</p>
									<h3 className="mt-4 text-2xl font-bold text-zinc-100 font-display">
										{item.title}
									</h3>
									<p className="mt-4 leading-7 text-zinc-400">
										{item.description}
									</p>
									<ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-300">
										{item.points.map((point) => (
											<li key={point} className="border-l border-zinc-700 pl-4">
												{point}
											</li>
										))}
									</ul>
									<p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-300">
										{text.readMore}
										<ExternalLink className="h-4 w-4" />
									</p>
								</article>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
