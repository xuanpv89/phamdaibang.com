"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { LanguagePicker, useLanguage } from "./language";
import { blogPath, sitePath } from "./site-paths";

const copy = {
	vi: {
		blog: "Bài viết",
		about: "Giới thiệu",
		projects: "Dự án",
		contact: "Liên hệ",
	},
	en: {
		blog: "Blog",
		about: "About",
		projects: "Projects",
		contact: "Contact",
	},
};

export const Navigation: React.FC = () => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const { language } = useLanguage();
	const text = copy[language];
	const blogHref = blogPath(language);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur duration-200 border-b ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-zinc-900/500 border-zinc-800"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-3 sm:gap-x-8">
						<Link
							href={blogHref}
							className="text-[15px] leading-6 duration-200 text-zinc-400 hover:text-zinc-100 sm:text-base"
						>
							{text.blog}
						</Link>
						<Link
							href={sitePath(language, "/about")}
							className="text-[15px] leading-6 duration-200 text-zinc-400 hover:text-zinc-100 sm:text-base"
						>
							{text.about}
						</Link>
						<Link
							href={sitePath(language, "/projects")}
							className="text-[15px] leading-6 duration-200 text-zinc-400 hover:text-zinc-100 sm:text-base"
						>
							{text.projects}
						</Link>
						<Link
							href={sitePath(language, "/contact")}
							className="text-[15px] leading-6 duration-200 text-zinc-400 hover:text-zinc-100 sm:text-base"
						>
							{text.contact}
						</Link>
						<LanguagePicker />
					</div>

					<Link
						href={sitePath(language, "/")}
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>
				</div>
			</div>
		</header>
	);
};
