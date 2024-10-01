import type { CookieSerializeOptions } from "vinxi/http"

export const COOKIE_OPTIONS = {
   path: "/",
   secure: process.env.NODE_ENV === "production",
   httpOnly: true,
   maxAge: 60 * 10,
   sameSite: "lax",
} satisfies CookieSerializeOptions
