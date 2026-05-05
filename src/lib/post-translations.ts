import { getBlogPostPath } from "@/lib/blog-paths";
import { isPostInLocale, locales, type Locale } from "@/lib/i18n";

type PostWithTranslationTags = {
  slug: string;
  tags?: { name: string }[];
};

export type AlternatePostPaths = Partial<Record<Locale, string>>;

const translationTagPrefix = "i18n:";

export function getTranslationKey(tags: { name: string }[] | undefined) {
  return tags
    ?.map((tag) => tag.name.trim())
    .find((name) => name.toLowerCase().startsWith(translationTagPrefix));
}

export function getAlternatePostPaths(
  currentPost: PostWithTranslationTags,
  posts: PostWithTranslationTags[]
): AlternatePostPaths {
  const translationKey = getTranslationKey(currentPost.tags);

  return Object.fromEntries(
    locales.map((locale) => {
      const translatedPost = translationKey
        ? posts.find(
            (post) =>
              post.slug !== currentPost.slug &&
              getTranslationKey(post.tags)?.toLowerCase() ===
                translationKey.toLowerCase() &&
              isPostInLocale(post.tags, locale)
          )
        : undefined;

      const slug = translatedPost?.slug ?? currentPost.slug;
      return [locale, getBlogPostPath(locale, slug)];
    })
  );
}
