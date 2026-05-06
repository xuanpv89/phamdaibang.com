const WISP_REST_BASE_URL = "https://www.wisp.blog/api/rest/v1";

export type WispRestTag = {
  id: string;
  name: string;
  description: string | null;
};

export type WispRestPostListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string | null;
    email?: string | null;
  };
  tags: Array<{
    tag: WispRestTag;
  }>;
};

export type WispRestPost = WispRestPostListItem & {
  content: string;
  metadata: string | null;
};

export type WispRestPostPayload = {
  title: string;
  content: string;
  slug: string;
  description?: string | null;
  publishedAt?: string | null;
  image?: string | null;
  metadata?: string | null;
  tagIds?: string[];
};

function getApiKey() {
  const apiKey = process.env.WISP_API_KEY;

  if (!apiKey) {
    throw new Error("WISP_API_KEY is missing.");
  }

  return apiKey;
}

async function wispRestFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${WISP_REST_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = response.statusText;

    try {
      const body = (await response.json()) as { error?: string; message?: string };
      errorMessage = body.error || body.message || errorMessage;
    } catch {}

    throw new Error(errorMessage || "Wisp REST API request failed.");
  }

  return (await response.json()) as T;
}

export async function listWispRestPosts({
  page = 1,
  limit = 100,
  query,
}: {
  page?: number;
  limit?: number;
  query?: string;
}) {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query) {
    searchParams.set("query", query);
  }

  return wispRestFetch<{
    posts: WispRestPostListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/posts?${searchParams.toString()}`);
}

export async function getWispRestPost(slug: string) {
  return wispRestFetch<WispRestPost>(`/posts/${slug}`);
}

export async function createWispRestPost(payload: WispRestPostPayload) {
  return wispRestFetch<WispRestPost>("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateWispRestPost(
  slug: string,
  payload: WispRestPostPayload
) {
  return wispRestFetch<WispRestPost>(`/posts/${slug}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteWispRestPost(slug: string) {
  return wispRestFetch<{ success: boolean }>(`/posts/${slug}`, {
    method: "DELETE",
  });
}

export async function getWispSignedUploadUrl(path: string) {
  return wispRestFetch<{ uploadURL: string }>("/uploads/signed-url", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}
