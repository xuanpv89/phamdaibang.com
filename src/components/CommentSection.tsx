"use client";

import { useQuery } from "@tanstack/react-query";
import { wisp } from "@/lib/wisp";
import { dictionary, type Locale } from "@/lib/i18n";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  slug: string;
  locale: Locale;
}

export function CommentSection({ slug, locale }: CommentSectionProps) {
  const text = dictionary[locale];
  const { data, isLoading } = useQuery({
    queryKey: ["comments", slug],
    queryFn: () => wisp.getComments({ slug, page: 1, limit: "all" }),
  });

  if (isLoading) {
    return <div>{text.loading}</div>;
  }

  if (!data?.config.enabled) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">
        {text.addCommentTitle}
      </h2>
      <CommentForm slug={slug} config={data.config} locale={locale} />
      <h2 className="mb-8 mt-16 text-2xl font-bold tracking-tight">
        {text.commentsTitle}
      </h2>
      <CommentList
        comments={data.comments}
        pagination={data.pagination}
        config={data.config}
        isLoading={isLoading}
        locale={locale}
      />
    </div>
  );
}
