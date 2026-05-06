import { ensureCmsAccess } from "@/lib/cms-auth";
import {
  createWispRestPost,
  listWispRestPosts,
  type WispRestPostPayload,
} from "@/lib/wisp-rest";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const accessResponse = await ensureCmsAccess();

  if (accessResponse) {
    return accessResponse;
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("query") || undefined;
  const page = Number(url.searchParams.get("page") || "1");
  const limit = Number(url.searchParams.get("limit") || "100");

  try {
    const result = await listWispRestPosts({ query, page, limit });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const accessResponse = await ensureCmsAccess();

  if (accessResponse) {
    return accessResponse;
  }

  try {
    const body = (await request.json()) as WispRestPostPayload;
    const post = await createWispRestPost(body);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post." },
      { status: 500 }
    );
  }
}
