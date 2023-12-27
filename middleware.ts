import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = { 
  matcher: [
    "/conversations/:path*",
    "/users/:path*",
    "/knowledge/:path*",
    "/robots/:path*",
    "/roles/:path*",
    "/masks/:path*",
    "/robotmarket/:path*",
  ]
};