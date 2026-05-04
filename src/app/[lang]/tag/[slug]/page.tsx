import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import {
  dictionary,
  getLocalizedPath,
  isLocale,
  languageTagNames,
  type Locale,
} from "@/lib/i18n";
import { wisp } from "@/lib/wisp";
import { CircleX } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Params {
  lang: string;
  slug: string;
}

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
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const result = await wisp.getPosts({
    limit: "all",
    tags: [slug],
  });
  const posts = result.posts.filter((post) =>
    post.tags.some(
      (tag) => tag.name.toLowerCase() === languageTagNames[locale]
    )
  );
  const totalPages = Math.max(1, Math.ceil(posts.length / limit));
  const pagePosts = posts.slice((page - 1) * limit, page * limit);
  const pagination = {
    page,
    limit,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header locale={locale} />
      <Link href={getLocalizedPath(locale, "/")}>
        <Badge className="px-2 py-1">
          <CircleX className="inline-block w-4 h-4 mr-2" />
          {dictionary[locale].taggedWith}{" "}
          <strong className="mx-2">#{slug}</strong>
        </Badge>
      </Link>
      <BlogPostsPreview posts={pagePosts} locale={locale} />
      <BlogPostsPagination
        pagination={pagination}
        basePath={`/${locale}/tag/${slug}/?page=`}
      />
      <Footer />
    </div>
  );
};

export default Page;
