import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const CMS_SESSION_COOKIE = "cms_session";

function getAuthConfig() {
  const password = process.env.CMS_LOGIN_PASSWORD || "";
  const secret = process.env.CMS_SESSION_SECRET || password;

  return {
    password,
    secret,
    enabled: Boolean(password && secret),
  };
}

function signSessionValue() {
  const { secret } = getAuthConfig();

  return createHmac("sha256", secret)
    .update("phamdaibang-cms-session")
    .digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isCmsAuthEnabled() {
  return getAuthConfig().enabled;
}

export function isCmsWriteEnabled() {
  return Boolean(process.env.WISP_API_KEY);
}

export function isCmsPasswordValid(password: string) {
  const auth = getAuthConfig();

  if (!auth.enabled) {
    return false;
  }

  return safeEqual(password, auth.password);
}

export async function hasCmsSession() {
  if (!isCmsAuthEnabled()) {
    return false;
  }

  const cookieStore = await cookies();
  const currentValue = cookieStore.get(CMS_SESSION_COOKIE)?.value;

  if (!currentValue) {
    return false;
  }

  return safeEqual(currentValue, signSessionValue());
}

export function applyCmsSession(response: NextResponse) {
  response.cookies.set(CMS_SESSION_COOKIE, signSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearCmsSession(response: NextResponse) {
  response.cookies.set(CMS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function ensureCmsAccess() {
  if (!isCmsAuthEnabled()) {
    return NextResponse.json(
      {
        error:
          "CMS authentication is not configured. Set CMS_LOGIN_PASSWORD to enable direct editing.",
      },
      { status: 503 }
    );
  }

  if (!(await hasCmsSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCmsWriteEnabled()) {
    return NextResponse.json(
      {
        error:
          "WISP_API_KEY is missing. Direct editing is disabled until the Wisp REST API key is configured.",
      },
      { status: 503 }
    );
  }

  return null;
}
