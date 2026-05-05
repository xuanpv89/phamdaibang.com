import { redirect } from "next/navigation";

interface Params {
  slug: string;
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  redirect(`/vi/tag/${params.slug}`);
}
