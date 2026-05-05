import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import { isLocale, isPostInLocale, type Locale } from "@/lib/i18n";
import {
  hasVietnamesePostContent,
  localizePost,
  localizePosts,
} from "@/lib/localized-posts";
import { signOgImageUrl } from "@/lib/og-image";
import { getAlternatePostPaths } from "@/lib/post-translations";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

type PostWithOptionalTags = {
  tags?: { name: string }[];
};

interface Params {
  lang: string;
  slug: string;
}

export const dynamic = "force-dynamic";

async function getLocalePostSummary(slug: string, locale: Locale) {
  const result = await wisp.getPosts({ limit: "all" });
  const post = result.posts.find((post) => {
    if (post.slug !== slug) return false;

    return (
      isPostInLocale(post.tags, locale) ||
      (locale === "vi" && hasVietnamesePostContent(post.slug))
    );
  });

  return post ?? null;
}

async function getPostAlternatePaths(slug: string, locale: Locale) {
  const result = await wisp.getPosts({ limit: "all" });
  const post = result.posts.find(
    (post) =>
      post.slug === slug &&
      (isPostInLocale(post.tags, locale) ||
        (locale === "vi" && hasVietnamesePostContent(post.slug)))
  );

  if (!post) return undefined;

  return getAlternatePostPaths(post, result.posts);
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return {
      title: "Blog post not found",
    };
  }

  const locale: Locale = params.lang;
  const { slug } = params;
  const localePost = await getLocalePostSummary(slug, locale);

  if (!localePost) {
    return {
      title: "Blog post not found",
    };
  }

  const result = await wisp.getPost(slug);

  if (!result || !result.post) {
    return {
      title: "Blog post not found",
    };
  }

  const post = localizePost(result.post, locale);
  const { title, description, image } = post;
  const generatedOgImage = signOgImageUrl({ title, brand: config.blog.name });
  const alternatePaths = await getPostAlternatePaths(slug, locale);

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.lang}/blog/${slug}`,
      languages: alternatePaths,
    },
    openGraph: {
      title,
      description,
      url: `/${params.lang}/blog/${slug}`,
      images: image ? [generatedOgImage, image] : [generatedOgImage],
    },
  };
}

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  const locale: Locale = params.lang;
  const { slug } = params;

  const localePost = await getLocalePostSummary(slug, locale);

  if (!localePost) {
    return notFound();
  }

  const result = await wisp.getPost(slug);
  const { posts } = await wisp.getRelatedPosts({ slug, limit: 3 });
  const allPosts = await wisp.getPosts({ limit: "all" });

  if (!result || !result.post) {
    return notFound();
  }

  const post = localizePost(result.post, locale);
  const { title, publishedAt, updatedAt, image, author } = post;
  const alternatePaths = getAlternatePostPaths(localePost, allPosts.posts);

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    image: image ? image : undefined,
    datePublished: publishedAt ? publishedAt.toString() : undefined,
    dateModified: updatedAt.toString(),
    author: {
      "@type": "Person",
      name: author.name ?? undefined,
      image: author.image ?? undefined,
    },
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-5">
        <Header locale={locale} alternatePaths={alternatePaths} />
        <div className="max-w-prose mx-auto text-xl">
          <BlogPostContent post={post} locale={locale} />
          <RelatedPosts
            posts={localizePosts(
              posts.filter(
                (post) =>
                  isPostInLocale((post as PostWithOptionalTags).tags, locale) ||
                  (locale === "vi" && hasVietnamesePostContent(post.slug))
              ),
              locale
            )}
            locale={locale}
          />
          <CommentSection slug={`${locale}/${slug}`} locale={locale} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Page;
