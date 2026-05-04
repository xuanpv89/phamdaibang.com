import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  dictionary,
  isLocale,
  languageTagNames,
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
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const result = await wisp.getPosts({
    limit: 6,
    page,
    tags: [languageTagNames[locale]],
  });

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header locale={locale} />
      {result.posts.length > 0 ? (
        <>
          <BlogPostsPreview posts={result.posts} locale={locale} />
          <BlogPostsPagination
            pagination={result.pagination}
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
