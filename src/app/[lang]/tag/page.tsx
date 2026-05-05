import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { config } from "@/config";
import { getBlogTagPath } from "@/lib/blog-paths";
import {
  dictionary,
  isLocale,
  removeLanguageTags,
  type Locale,
} from "@/lib/i18n";
import { signOgImageUrl } from "@/lib/og-image";
import { wisp } from "@/lib/wisp";
import { notFound } from "next/navigation";
import Link from "next/link";

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

  return {
    title: dictionary[locale].tagsTitle,
    description: dictionary[locale].tagsDescription,
    alternates: {
      canonical: `/${locale}/tag`,
      languages: {
        vi: "/vi/tag",
        en: "/en/tag",
      },
    },
    openGraph: {
      title: dictionary[locale].tagsTitle,
      description: dictionary[locale].tagsDescription,
      url: `/${locale}/tag`,
      images: [
        signOgImageUrl({
          title: dictionary[locale].tagsTitle,
          brand: config.blog.name,
        }),
      ],
    },
  };
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  const locale: Locale = params.lang;
  const result = await wisp.getTags();
  const tags = removeLanguageTags(result.tags);

  return (
    <div className="container mx-auto px-5">
      <Header locale={locale} />
      <div className="mt-20 mb-12 text-center">
        <h1 className="mb-2 text-5xl font-bold">
          {dictionary[locale].tagsTitle}
        </h1>
        <p className="text-lg opacity-50">
          {dictionary[locale].tagsDescription}
        </p>
      </div>
      <div className="my-10 max-w-6xl text-balance text-center text-xl mb-48">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={getBlogTagPath(locale, tag.name)}
            className="text-primary mr-2 inline-block"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
