"use client";

import { format } from "date-fns";
import Link from "next/link";
import { dictionary, type Locale } from "@/lib/i18n";

interface CommentListProps {
  comments: {
    id: string;
    author: string;
    content: string;
    url?: string | null;
    createdAt: Date;
    parent?: {
      id: string;
      author: string;
      content: string;
      url?: string | null;
      createdAt: Date;
    } | null;
  }[];
  pagination: {
    page: number;
    limit: number | "all";
    totalPages: number;
    totalComments: number;
  };
  config: {
    enabled: boolean;
    allowUrls: boolean;
    allowNested: boolean;
  };
  isLoading?: boolean;
  locale: Locale;
}

export function CommentList({
  comments,
  config,
  isLoading,
  locale,
}: CommentListProps) {
  const text = dictionary[locale];

  if (isLoading) {
    return <div className="animate-pulse">{text.loading}</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="text-muted-foreground mt-8 text-center">
        {text.noComments}
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          {comment.parent && (
            <div className="ml-8 border-l-2 pl-4">
              <div className="text-muted-foreground mb-2 text-sm">
                In reply to {comment.parent.author}
              </div>
              <div className="text-muted-foreground whitespace-pre-line text-sm">
                {comment.parent.content}
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.allowUrls && comment.url ? (
                  <Link href={comment.url} target="_blank" rel="nofollow">
                    <span className="font-medium">{comment.author}</span>
                  </Link>
                ) : (
                  <span className="font-medium">{comment.author}</span>
                )}
              </div>
              <div className="text-muted-foreground text-sm">
                {format(new Date(comment.createdAt), "PPp")}
              </div>
            </div>
            <div className="mt-2 whitespace-pre-line text-sm">
              {comment.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
