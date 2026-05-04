import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  dictionary,
  isLocale,
  isPostInLocale,
  type Locale,
} from "@/lib/i18n";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";

interface Params {
  lang: string;
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
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const result = await wisp.getPosts({
    limit: "all",
  });
  const posts = result.posts.filter((post) => isPostInLocale(post.tags, locale));
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
      {pagePosts.length > 0 ? (
        <>
          <BlogPostsPreview posts={pagePosts} locale={locale} />
          <BlogPostsPagination
            pagination={pagination}
            basePath={`/${locale}?page=`}
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
