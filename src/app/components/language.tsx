"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Language = "vi" | "en";

const storageKey = "phamdaibang-language";
const defaultLanguage: Language = "vi";

function isLanguage(value: string | null): value is Language {
	return value === "vi" || value === "en";
}

function getLanguageFromPath(pathname: string): Language | null {
	const firstSegment = pathname.split("/").filter(Boolean)[0] ?? null;
	return isLanguage(firstSegment) ? firstSegment : null;
}

function localizedPath(pathname: string, language: Language) {
	const segments = pathname.split("/").filter(Boolean);

	if (isLanguage(segments[0] ?? null)) {
		segments[0] = language;
		return `/${segments.join("/")}`;
	}

	return `/${language}${pathname === "/" ? "" : pathname}`;
}

export function useLanguage() {
	const pathname = usePathname();
	const routeLanguage = getLanguageFromPath(pathname);
	const [language, setLanguageState] = useState<Language>(
		routeLanguage ?? defaultLanguage,
	);

	useEffect(() => {
		if (routeLanguage) {
			setLanguageState(routeLanguage);
			document.documentElement.lang = routeLanguage;
			window.localStorage.setItem(storageKey, routeLanguage);
			return;
		}

		const saved = window.localStorage.getItem(storageKey);
		if (isLanguage(saved)) {
			setLanguageState(saved);
			document.documentElement.lang = saved;
		}

		function onLanguageChange(event: Event) {
			const next = (event as CustomEvent<Language>).detail;
			if (isLanguage(next)) {
				setLanguageState(next);
				document.documentElement.lang = next;
			}
		}

		function onStorage(event: StorageEvent) {
			if (event.key === storageKey && isLanguage(event.newValue)) {
				setLanguageState(event.newValue);
				document.documentElement.lang = event.newValue;
			}
		}

		window.addEventListener("languagechange", onLanguageChange);
		window.addEventListener("storage", onStorage);

		return () => {
			window.removeEventListener("languagechange", onLanguageChange);
			window.removeEventListener("storage", onStorage);
		};
	}, [routeLanguage]);

	function setLanguage(next: Language) {
		setLanguageState(next);
		document.documentElement.lang = next;
		window.localStorage.setItem(storageKey, next);
		window.dispatchEvent(new CustomEvent("languagechange", { detail: next }));
	}

	return { language, setLanguage };
}

export function LanguagePicker({ className = "" }: { className?: string }) {
	const { language, setLanguage } = useLanguage();
	const router = useRouter();
	const pathname = usePathname();
	const options: { value: Language; label: string }[] = [
		{ value: "vi", label: "VI" },
		{ value: "en", label: "EN" },
	];

	return (
		<div
			className={`inline-flex items-center rounded-full border border-zinc-700 bg-black/20 p-1 backdrop-blur ${className}`}
			aria-label={language === "vi" ? "Chọn ngôn ngữ" : "Choose language"}
		>
			{options.map((option) => {
				const active = option.value === language;
				return (
					<button
						key={option.value}
						type="button"
						aria-pressed={active}
						onClick={() => {
							setLanguage(option.value);
							router.push(localizedPath(pathname, option.value));
						}}
						className={`min-w-10 rounded-full px-3 py-1 text-xs font-medium duration-200 ${
							active
								? "bg-zinc-100 text-zinc-950"
								: "text-zinc-500 hover:text-zinc-200"
						}`}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}
