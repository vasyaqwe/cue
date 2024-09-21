// app.config.ts
import { defineConfig } from "@tanstack/start/config"
import tsConfigPaths from "vite-tsconfig-paths"
const app_config_default = defineConfig({
   vite: {
      plugins: () => [
         tsConfigPaths({
            projects: ["./tsconfig.json"],
         }),
      ],
   },
})
export { app_config_default as default }
