import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { config } from "@/config";
import { dictionary, isLocale, type Locale } from "@/lib/i18n";
import { signOgImageUrl } from "@/lib/og-image";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

interface Params {
  lang: string;
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return {
      title: "Not found",
    };
  }

  const locale: Locale = params.lang;
  const text = dictionary[locale];

  return {
    title: text.aboutTitle,
    description: text.aboutDescription,
    openGraph: {
      title: text.aboutTitle,
      description: text.aboutDescription,
      images: [
        signOgImageUrl({
          title: text.aboutTitle,
          label: "About",
          brand: config.blog.name,
        }),
      ],
    },
  };
}

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  const locale: Locale = params.lang;

  return (
    <div className="container mx-auto px-5">
      <Header locale={locale} />
      <div className="prose lg:prose-lg dark:prose-invert m-auto mt-20 mb-10 blog-content">
        <Markdown>{dictionary[locale].aboutContent}</Markdown>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
