import type { Language } from "./language";

export function sitePath(language: Language, path: string) {
	return `/${language}${path === "/" ? "" : path}`;
}

export function blogPath(language: Language) {
	return sitePath(language, "/blog");
}
