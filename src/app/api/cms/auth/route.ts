import {
  applyCmsSession,
  clearCmsSession,
  isCmsAuthEnabled,
  isCmsPasswordValid,
} from "@/lib/cms-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isCmsAuthEnabled()) {
    return NextResponse.json(
      {
        error:
          "CMS authentication is not configured. Set CMS_LOGIN_PASSWORD to enable login.",
      },
      { status: 503 }
    );
  }

  const body = (await request.json()) as { password?: string };

  if (!body.password || !isCmsPasswordValid(body.password)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  applyCmsSession(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearCmsSession(response);
  return response;
}
