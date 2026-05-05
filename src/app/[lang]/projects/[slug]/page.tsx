import { ProjectDetailClient } from "@/app/projects/[slug]/ProjectDetailClient";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface Params {
  lang: string;
  slug: string;
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  return <ProjectDetailClient slug={params.slug} />;
}
