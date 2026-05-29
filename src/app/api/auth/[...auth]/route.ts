import { NextRequest, NextResponse } from "next/server";
import { getLyricPaletteApiBaseUrl } from "@/integrations/lyric-palette/config";

const BACKEND_BASE = getLyricPaletteApiBaseUrl();
const COOKIE_NAME = "lp_refresh";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days — matches backend token lifetime

function setRefreshCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

function clearRefreshCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

async function backendPost<T>(
  path: string,
  body: unknown,
  headers?: Record<string, string>,
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = res.ok ? ((await res.json()) as T) : null;
  if (!res.ok) {
    try {
      const err = (await res.json()) as unknown;
      return { ok: false, status: res.status, data: err as T };
    } catch {
      return { ok: false, status: res.status, data: null };
    }
  }
  return { ok: true, status: res.status, data };
}

async function backendGet<T>(
  path: string,
  accessToken: string,
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await fetch(`${BACKEND_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const data = res.ok ? ((await res.json()) as T) : null;
  return { ok: res.ok, status: res.status, data };
}

type UserPayload = {
  id: string;
  login: string;
  name: string | null;
  howFound: string | null;
  germanLevel: string | null;
  country: string | null;
  language: string | null;
  goals: string | null;
  newsletter?: boolean;
};

type AuthSuccessPayload = {
  data: {
    user: UserPayload;
    accessToken: string;
    refreshToken: string;
  };
};

type MePayload = {
  data: UserPayload;
};

type RefreshPayload = {
  data: { accessToken: string; refreshToken: string };
};

// POST /api/auth/login
async function handleLogin(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as unknown;
    const result = await backendPost<AuthSuccessPayload>("/auth/login", body);

    if (!result.ok || !result.data) {
      return NextResponse.json(result.data, { status: result.status });
    }

    const { user, accessToken, refreshToken } = result.data.data;
    const res = NextResponse.json({ user, accessToken }, { status: 200 });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/auth/register
async function handleRegister(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as unknown;
    const result = await backendPost<AuthSuccessPayload>(
      "/auth/register",
      body,
    );

    if (!result.ok || !result.data) {
      return NextResponse.json(result.data, { status: result.status });
    }

    const { user, accessToken, refreshToken } = result.data.data;
    const res = NextResponse.json({ user, accessToken }, { status: 201 });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/auth/refresh — reads httpOnly cookie, rotates it, returns { user, accessToken }
async function handleRefresh(req: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = req.cookies.get(COOKIE_NAME)?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { status: "error", message: "No refresh token" },
        { status: 401 },
      );
    }

    const refreshResult = await backendPost<RefreshPayload>("/auth/refresh", {
      refreshToken,
    });

    if (!refreshResult.ok || !refreshResult.data) {
      const res = NextResponse.json(refreshResult.data, {
        status: refreshResult.status,
      });
      clearRefreshCookie(res);
      return res;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      refreshResult.data.data;

    // Fetch user with the new access token.
    // Set the new refresh cookie regardless of the /auth/me outcome so the token
    // is never lost: the old one was already rotated (revoked) by the backend.
    const meResult = await backendGet<MePayload>("/auth/me", accessToken);
    if (!meResult.ok || !meResult.data) {
      // Transient error — preserve the new token so the client can retry.
      const errRes = NextResponse.json(
        { status: "error", message: "Could not fetch user" },
        { status: 502 },
      );
      setRefreshCookie(errRes, newRefreshToken);
      return errRes;
    }

    const user = meResult.data.data;
    const res = NextResponse.json({ user, accessToken }, { status: 200 });
    setRefreshCookie(res, newRefreshToken);
    return res;
  } catch {
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/auth/logout — revokes refresh token, always clears cookie
async function handleLogout(req: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = req.cookies.get(COOKIE_NAME)?.value;
    if (refreshToken) {
      await backendPost("/auth/logout", { refreshToken }).catch(() => {});
    }
    const res = NextResponse.json({ success: true }, { status: 200 });
    clearRefreshCookie(res);
    return res;
  } catch {
    const res = NextResponse.json({ success: true }, { status: 200 });
    clearRefreshCookie(res);
    return res;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> },
): Promise<NextResponse> {
  const { auth } = await params;
  const action = auth[0];

  switch (action) {
    case "login":
      return handleLogin(req);
    case "register":
      return handleRegister(req);
    case "refresh":
      return handleRefresh(req);
    case "logout":
      return handleLogout(req);
    default:
      return NextResponse.json({ status: "error", message: "Not found" }, { status: 404 });
  }
}
