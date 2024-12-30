import { env } from "@/env"
import type { CookieSerializeOptions } from "vinxi/http"

export const COOKIE_OPTIONS = {
   httpOnly: true,
   sameSite: "lax",
   secure: env.NODE_ENV === "production",
   path: "/",
   maxAge: 600,
} satisfies CookieSerializeOptions

export const APP_USER_ID = "user_cue"
