import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { getBlogIndexPath } from "@/lib/blog-paths";
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
import { wisp } from "@/lib/wisp";
import { CircleX } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Params {
  lang: string;
  slug: string;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return {
      title: "Not found",
    };
  }

  return {
    title: `#${params.slug}`,
    description: `${dictionary[params.lang].taggedWith} #${params.slug}`,
    alternates: {
      canonical: `/${params.lang}/tag/${params.slug}`,
      languages: {
        vi: `/vi/tag/${params.slug}`,
        en: `/en/tag/${params.slug}`,
      },
    },
    openGraph: {
      title: `#${params.slug}`,
      description: `${dictionary[params.lang].taggedWith} #${params.slug}`,
      url: `/${params.lang}/tag/${params.slug}`,
    },
  };
}

const Page = async (props: {
  params: Promise<Params>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  const locale: Locale = params.lang;
  const { slug } = params;
  const limit = 6;
  const page = parsePositivePage(searchParams.page);
  const result = await wisp.getPosts({
    limit: "all",
    tags: [slug],
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
      <Link href={getBlogIndexPath(locale)}>
        <Badge className="px-2 py-1">
          <CircleX className="inline-block w-4 h-4 mr-2" />
          {dictionary[locale].taggedWith}{" "}
          <strong className="mx-2">#{slug}</strong>
        </Badge>
      </Link>
      <BlogPostsPreview posts={pagePosts} locale={locale} />
      <BlogPostsPagination
        pagination={pagination}
        basePath={`/${locale}/tag/${slug}?page=`}
      />
      <Footer />
    </div>
  );
};

export default Page;
