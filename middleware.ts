import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// MAIN MIDDLEWARE FUNCTION FOR AUTHENTICATION AND ROUTE HANDLING
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = (await getToken({ req })) as {
    exp?: number;
    routes?: string[];
  } | null; // Explicit type for the token
  const currentTime: number = Math.floor(Date.now() / 1000); // Current time in seconds

  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  if (!token || (typeof token.exp === "number" && token.exp < currentTime)) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("next-auth.session-token", "", {
      path: "/",
      expires: new Date(0),
    });
    response.cookies.set("__Secure-next-auth.session-token", "", {
      path: "/",
      expires: new Date(0),
    });

    return response;
  }

  // const sessionActive = req.cookies.get("sessionActive")?.value;
  // console.log("Session Active Cookie Value: ", sessionActive);

  // if (!sessionActive) {
  //   const response = NextResponse.redirect(new URL("/login", req.url));
  //   response.cookies.set("sessionActive", "true", {
  //     path: "/",
  //     expires: new Date(0),
  //   });
  //   response.cookies.set("next-auth.session-token", "", {
  //     path: "/",
  //     expires: new Date(0),
  //   });
  //   response.cookies.set("__Secure-next-auth.session-token", "", {
  //     path: "/",
  //     expires: new Date(0),
  //   });
  //   return response;
  // }

  // Safely access routes from the token or initialize as an empty array
  const allowedRoutes = Array.isArray(token.routes) ? token.routes : [];
  const pathname = req.nextUrl.pathname;

  console.log("Token Routes:", token.routes, "Pathname:", pathname);

  // Check if the requested path matches any of the allowed routes
  // const isRouteAllowed = allowedRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // // If the route is not allowed, clear the session cookies and redirect to sign-in page
  // if (!isRouteAllowed) {
  //   const response = NextResponse.redirect(new URL("/login", req.url));
  //   response.cookies.set("next-auth.session-token", "", {
  //     path: "/",
  //     expires: new Date(0),
  //   });
  //   response.cookies.set("__Secure-next-auth.session-token", "", {
  //     path: "/",
  //     expires: new Date(0),
  //   });

  //   return response;
  // }

  // If the route is allowed, proceed to the next handler
  return NextResponse.next();
}

// Configure the routes that this middleware should apply to
export const config = {
  matcher: [
    // "/dashboard",
    // "/admin",
    // "/staff",
    // "/login-success",
    // "/customer",
    // "/users",
    // "/generalSettings",
    // "/reservations",
    // "/orders",
    // "/invoice",
    // "/readerTest",
    // "/payment-received",
    // "/supplier"
  ],
};
