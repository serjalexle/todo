import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ua"], // ? available locales
  defaultLocale: "en", // ? default locale
});

export const config = {
  matcher: ["/((?!_next|_vercel|api|static|favicon.ico).*)"],
};
