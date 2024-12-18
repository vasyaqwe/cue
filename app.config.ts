import { defineConfig } from "@tanstack/start/config"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
   vite: {
      plugins: [
         // @ts-expect-error ...
         tsConfigPaths({
            projects: ["./tsconfig.json"],
         }),
      ],
   },
})
