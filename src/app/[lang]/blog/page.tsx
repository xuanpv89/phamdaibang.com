import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { config } from "@/config";
import {
  dictionary,
  isLocale,
  isPostInLocale,
  type Locale,
} from "@/lib/i18n";
import {
  hasVietnamesePostContent,
  localizePosts,
} from "@/lib/localized-posts";
import { paginate, parsePositivePage } from "@/lib/pagination";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";

interface Params {
  lang: string;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return {
      title: "Not found",
    };
  }

  const locale: Locale = params.lang;
  const title = dictionary[locale].allPosts;
  const description = config.blog.metadata.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        vi: "/vi/blog",
        en: "/en/blog",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/blog`,
      images: [
        signOgImageUrl({
          title,
          brand: config.blog.name,
        }),
      ],
    },
  };
}

const Page = async (props: {
  params: Promise<Params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  const locale: Locale = params.lang;
  const limit = 6;
  const page = parsePositivePage(searchParams.page);
  const result = await wisp.getPosts({
    limit: "all",
  });
  const posts = localizePosts(
    result.posts.filter(
      (post) =>
        isPostInLocale(post.tags, locale) ||
        (locale === "vi" && hasVietnamesePostContent(post.slug))
    ),
    locale
  );
  const { items: pagePosts, pagination } = paginate(posts, page, limit);

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header locale={locale} />
      {pagePosts.length > 0 ? (
        <>
          <BlogPostsPreview posts={pagePosts} locale={locale} />
          <BlogPostsPagination
            pagination={pagination}
            basePath={`/${locale}/blog?page=`}
          />
        </>
      ) : (
        <div className="my-24 text-center text-muted-foreground">
          {dictionary[locale].emptyPosts}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Page;
