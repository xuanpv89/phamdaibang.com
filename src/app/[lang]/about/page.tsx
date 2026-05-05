import AboutPage from "@/app/about/page";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface Params {
  lang: string;
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  return <AboutPage />;
}
