import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import { isLocale, isPostInLocale, type Locale } from "@/lib/i18n";
import { signOgImageUrl } from "@/lib/og-image";
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

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return {
      title: "Blog post not found",
    };
  }

  const { slug } = params;
  const result = await wisp.getPost(slug);

  if (!result || !result.post || !isPostInLocale(result.post.tags, params.lang)) {
    return {
      title: "Blog post not found",
    };
  }

  const { title, description, image } = result.post;
  const generatedOgImage = signOgImageUrl({ title, brand: config.blog.name });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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

  const result = await wisp.getPost(slug);
  const { posts } = await wisp.getRelatedPosts({ slug, limit: 3 });

  if (!result || !result.post || !isPostInLocale(result.post.tags, locale)) {
    return notFound();
  }

  const { title, publishedAt, updatedAt, image, author } = result.post;

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
        <Header locale={locale} />
        <div className="max-w-prose mx-auto text-xl">
          <BlogPostContent post={result.post} locale={locale} />
          <RelatedPosts
            posts={posts.filter((post) =>
              isPostInLocale((post as PostWithOptionalTags).tags, locale)
            )}
            locale={locale}
          />
          <CommentSection slug={`${locale}/${slug}`} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Page;
