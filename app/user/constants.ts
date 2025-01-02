import type { CookieSerializeOptions } from "vinxi/http"

export const COOKIE_OPTIONS = {
   httpOnly: true,
   sameSite: "lax",
   secure: import.meta.env.PROD,
   path: "/",
   maxAge: 600,
} satisfies CookieSerializeOptions

export const APP_USER_ID = "user_cue"
