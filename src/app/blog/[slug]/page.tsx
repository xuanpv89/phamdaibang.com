import { BlogLanguageRedirect } from "@/components/BlogLanguageRedirect";

interface Params {
  slug: string;
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;

  return <BlogLanguageRedirect slug={params.slug} />;
}
