import { ensureCmsAccess } from "@/lib/cms-auth";
import {
  deleteWispRestPost,
  getWispRestPost,
  updateWispRestPost,
  type WispRestPostPayload,
} from "@/lib/wisp-rest";
import { NextResponse } from "next/server";

interface Params {
  slug: string;
}

export async function GET(
  _request: Request,
  context: { params: Promise<Params> }
) {
  const accessResponse = await ensureCmsAccess();

  if (accessResponse) {
    return accessResponse;
  }

  try {
    const { slug } = await context.params;
    const post = await getWispRestPost(slug);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load post." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  const accessResponse = await ensureCmsAccess();

  if (accessResponse) {
    return accessResponse;
  }

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as WispRestPostPayload;
    const post = await updateWispRestPost(slug, body);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<Params> }
) {
  const accessResponse = await ensureCmsAccess();

  if (accessResponse) {
    return accessResponse;
  }

  try {
    const { slug } = await context.params;
    const result = await deleteWispRestPost(slug);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete post." },
      { status: 500 }
    );
  }
}
