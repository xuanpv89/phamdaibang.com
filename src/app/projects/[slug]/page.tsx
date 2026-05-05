import { ProjectDetailClient } from "./ProjectDetailClient";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  return <ProjectDetailClient slug={slug} />;
}
