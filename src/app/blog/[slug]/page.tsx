import { defaultLocale } from "@/lib/i18n";
import { redirect } from "next/navigation";

interface Params {
  slug: string;
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  redirect(`/${defaultLocale}/blog/${params.slug}`);
}
