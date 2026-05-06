"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
	ArrowRight,
	ExternalLink,
	Globe2,
	Image as ImageIcon,
	PlayCircle,
} from "lucide-react";
import { Card } from "../components/card";
import { Navigation } from "../components/nav";
import { useLanguage } from "../components/language";
import { blogPath, sitePath } from "../components/site-paths";

const portfolioUrl = "https://cv.phamdaibang.com/";
const mediaBase = "https://cv.phamdaibang.com/_assets/media";

const images = [
	{
		src: "/images/phamdaibang-profile.webp",
		alt: "Pham Dai Bang profile portrait",
	},
	{
		src: `${mediaBase}/b032fe29190570d24fec77f795343770.jpg`,
		alt: "Workshop and training session from the portfolio",
	},
	{
		src: `${mediaBase}/144b06d14ccf5dc6d5c84fd5808922b8.png`,
		alt: "Compassio website screenshot from the portfolio",
	},
	{
		src: `${mediaBase}/2afff922d2e2c60f065fdba9cf32ec9b.png`,
		alt: "Compassio social page screenshot from the portfolio",
	},
];

const copy = {
	en: {
		eyebrow: "About",
		title: "Pham Dai Bang",
		subtitle:
			"Communication, business development, human development, community building, writing, and content production.",
		bio:
			"Pham Dai Bang is the personal and professional presence of Pham Van Xuan, shaped through more than 10 years of work across business, sales, operations, education, wellbeing, community projects, writing, and creative content.",
		writingTitle: "Writing Corner",
		writingBody:
			"The blog is a quiet retreat for people who appreciate the weight of words and reflective thinking. It gathers A Cup of Words, fiction and non-fiction, poetry, notes, knowledge snapshots, economic paradoxes, and everyday observations.",
		identity: [
			"Family name: Pham Van Xuan",
			"Website: www.phamdaibang.com",
			"Purpose: working in communication, contributing to business success, creating value for society, and building sustainable income.",
		],
		metrics: [
			{ value: ">10", label: "years of experience" },
			{ value: ">50", label: "events and programs" },
			{ value: ">100k", label: "website visitors" },
			{ value: ">10k", label: "community members and audience reach" },
		],
		sections: [
			{
				title: "Business & operations",
				body:
					"Experience through Giao Hang Nhanh, The Coffee House, Tomato Education, and other business roles: sales management, store operations, process standardization, team coordination, and market development.",
			},
			{
				title: "Human development",
				body:
					"Project work around emotional intelligence, mental healthcare, self-awareness, wellbeing, workplace happiness, positive leadership, and community learning.",
			},
			{
				title: "Content & media",
				body:
					"Writing, podcast, video, translation, publication design, program scripts, editorial systems, and multimedia production for Compassio and personal projects.",
			},
		],
		mediaTitle: "Images from the portfolio",
		videoTitle: "Video, audio, and visual work",
		videoBody:
			"The Canva portfolio references Compassio Podcast & Video, Loitavent recordings, The Loop visual experiments, and content production work. Open the full portfolio for the original media context.",
		linksTitle: "Live links",
		links: [
			{ label: "Full portfolio", href: portfolioUrl },
			{ label: "Projects", href: "/projects" },
			{ label: "Writing Corner", href: "/projects/writing-corner" },
			{ label: "Blog", href: "/blog" },
			{ label: "Contact", href: "/contact" },
		],
		open: "Open",
	},
	vi: {
		eyebrow: "Giới thiệu",
		title: "Phạm Đại Bàng",
		subtitle:
			"Truyền thông, phát triển kinh doanh, phát triển con người, xây dựng cộng đồng, viết và sản xuất nội dung.",
		bio:
			"Phạm Đại Bàng là không gian cá nhân và nghề nghiệp của Phạm Văn Xuân, được hình thành qua hơn 10 năm làm việc trong kinh doanh, sales, vận hành, giáo dục, wellbeing, dự án cộng đồng, viết và sáng tạo nội dung.",
		writingTitle: "Writing Corner",
		writingBody:
			"Blog là một khoảng lặng cho những người quan tâm đến sức nặng của chữ và chiều sâu suy ngẫm. Ở đó có A Cup of Words, fiction và non-fiction, thơ, ghi chú, mảnh kiến thức, nghịch lý kinh tế và quan sát đời thường.",
		identity: [
			"Họ tên: Phạm Văn Xuân",
			"Website: www.phamdaibang.com",
			"Mục đích: làm việc trong lĩnh vực truyền thông, đóng góp cho thành công của doanh nghiệp, tạo lợi ích cho xã hội và xây dựng nguồn thu nhập bền vững.",
		],
		metrics: [
			{ value: ">10", label: "năm kinh nghiệm" },
			{ value: ">50", label: "sự kiện và chương trình" },
			{ value: ">100k", label: "lượt truy cập website" },
			{ value: ">10k", label: "thành viên cộng đồng và tệp độc giả" },
		],
		sections: [
			{
				title: "Kinh doanh & vận hành",
				body:
					"Kinh nghiệm qua Giao Hàng Nhanh, The Coffee House, Tomato Education và nhiều vai trò business: sales management, vận hành cửa hàng, chuẩn hóa quy trình, điều phối đội ngũ và phát triển thị trường.",
			},
			{
				title: "Phát triển con người",
				body:
					"Các dự án xoay quanh emotional intelligence, mental healthcare, self-awareness, wellbeing, workplace happiness, positive leadership và học tập cộng đồng.",
			},
			{
				title: "Nội dung & media",
				body:
					"Viết, podcast, video, dịch thuật, publication design, kịch bản chương trình, hệ thống biên tập và sản xuất multimedia cho Compassio cùng các dự án cá nhân.",
			},
		],
		mediaTitle: "Hình ảnh từ portfolio",
		videoTitle: "Video, audio và visual work",
		videoBody:
			"Portfolio Canva có nhắc tới Compassio Podcast & Video, Loitavent recordings, The Loop visual experiments và các phần content production. Mở portfolio đầy đủ để xem media trong đúng ngữ cảnh gốc.",
		linksTitle: "Liên kết",
		links: [
			{ label: "Portfolio đầy đủ", href: portfolioUrl },
			{ label: "Dự án", href: "/projects" },
			{ label: "Writing Corner", href: "/projects/writing-corner" },
			{ label: "Blog", href: "/blog" },
			{ label: "Liên hệ", href: "/contact" },
		],
		open: "Mở",
	},
};

export default function AboutPage() {
	const { language } = useLanguage();
	const text = copy[language];

	return (
		<div className="min-h-screen bg-black pb-16 text-zinc-100">
			<Navigation />
			<main className="mx-auto max-w-7xl px-6 pt-24 lg:px-8 lg:pt-32">
				<section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
							{text.eyebrow}
						</p>
						<h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
							{text.title}
						</h1>
						<p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-300">
							{text.subtitle}
						</p>
						<p className="mt-6 max-w-3xl leading-8 text-zinc-400">{text.bio}</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								href={portfolioUrl}
								target="_blank"
								className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 duration-200 hover:border-zinc-300 hover:text-white"
							>
								{text.links[0].label}
								<ExternalLink className="h-4 w-4" />
							</Link>
							<Link
								href={sitePath(language, "/projects")}
								className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 duration-200 hover:border-zinc-300 hover:text-white"
							>
								{text.links[1].label}
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					</div>
					<div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
						<Image
							src={images[0].src}
							alt={images[0].alt}
							width={900}
							height={900}
							priority
							sizes="(min-width: 1024px) 46vw, 100vw"
							className="h-full min-h-[320px] w-full object-cover"
						/>
					</div>
				</section>

				<section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{text.metrics.map((metric) => (
						<Card key={metric.label}>
							<div className="p-5">
								<p className="text-3xl font-bold text-white font-display">
									{metric.value}
								</p>
								<p className="mt-2 text-sm leading-6 text-zinc-400">
									{metric.label}
								</p>
							</div>
						</Card>
					))}
				</section>

				<section className="mt-12 grid gap-5 lg:grid-cols-3">
					{text.sections.map((section) => (
						<Card key={section.title}>
							<div className="h-full p-5 md:p-6">
								<h2 className="text-xl font-semibold text-white">
									{section.title}
								</h2>
								<p className="mt-4 leading-7 text-zinc-400">{section.body}</p>
							</div>
						</Card>
					))}
				</section>

				<section className="mt-12">
					<Card>
						<div className="grid gap-6 p-5 md:grid-cols-[0.65fr_1fr] md:p-6">
							<Image
								src="/images/phamdaibang-circle2026.webp"
								alt="Pham Dai Bang circular profile mark"
								width={720}
								height={720}
								loading="lazy"
								sizes="(min-width: 768px) 35vw, 100vw"
								className="aspect-square w-full rounded-xl object-cover"
							/>
							<div>
								<h2 className="text-2xl font-semibold text-white">
									{text.writingTitle}
								</h2>
								<p className="mt-4 leading-7 text-zinc-400">
									{text.writingBody}
								</p>
								<Link
									href={sitePath(language, "/projects/writing-corner")}
									className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-300 duration-200 hover:text-white"
								>
									{text.open}
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</div>
					</Card>
				</section>

				<section className="mt-12">
					<div className="flex items-center gap-3">
						<ImageIcon className="h-5 w-5 text-zinc-500" />
						<h2 className="text-2xl font-semibold text-white">
							{text.mediaTitle}
						</h2>
					</div>
					<div className="mt-6 grid gap-5 md:grid-cols-3">
						{images.slice(1).map((image) => (
							<div
								key={image.src}
								className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
							>
								<Image
									src={image.src}
									alt={image.alt}
									width={800}
									height={600}
									loading="lazy"
									sizes="(min-width: 768px) 33vw, 100vw"
									className="aspect-[4/3] w-full object-cover duration-500 hover:scale-[1.03]"
								/>
							</div>
						))}
					</div>
				</section>

				<section className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
					<Card>
						<div className="p-5 md:p-6">
							<div className="flex items-center gap-3">
								<PlayCircle className="h-5 w-5 text-zinc-500" />
								<h2 className="text-2xl font-semibold text-white">
									{text.videoTitle}
								</h2>
							</div>
							<p className="mt-4 leading-7 text-zinc-400">{text.videoBody}</p>
							<div className="mt-6 flex flex-wrap gap-3">
								<Link
									href={`${portfolioUrl}#page-6`}
									target="_blank"
									className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 duration-200 hover:border-zinc-300 hover:text-white"
								>
									Compassio Podcast & Video
									<ExternalLink className="h-4 w-4" />
								</Link>
								<Link
									href={sitePath(language, "/projects/content-production")}
									className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200 duration-200 hover:border-zinc-300 hover:text-white"
								>
									Content Production
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</div>
					</Card>

					<Card>
						<div className="p-5 md:p-6">
							<div className="flex items-center gap-3">
								<Globe2 className="h-5 w-5 text-zinc-500" />
								<h2 className="text-2xl font-semibold text-white">
									{text.linksTitle}
								</h2>
							</div>
							<div className="mt-5 grid gap-3 sm:grid-cols-2">
								{text.links.map((item) => {
									const href = item.href.startsWith("http")
										? item.href
										: item.href === "/blog"
											? blogPath(language)
											: sitePath(language, item.href);

									return (
										<Link
											key={href}
											href={href}
											target={href.startsWith("http") ? "_blank" : undefined}
											className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 px-4 py-3 text-sm text-zinc-300 duration-200 hover:border-zinc-500 hover:text-white"
										>
											<span>{item.label}</span>
											<span className="text-zinc-500">{text.open}</span>
										</Link>
									);
								})}
							</div>
						</div>
					</Card>
				</section>

				<section className="mt-12">
					<Card>
						<div className="p-5 md:p-6">
							<ul className="grid gap-3 text-sm leading-6 text-zinc-300 md:grid-cols-3">
								{text.identity.map((item) => (
									<li key={item} className="border-l border-zinc-700 pl-4">
										{item}
									</li>
								))}
							</ul>
						</div>
					</Card>
				</section>
			</main>
		</div>
	);
}
