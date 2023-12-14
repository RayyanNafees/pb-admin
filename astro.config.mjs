import million from 'million/compiler';
import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";

import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), sentry(), spotlightjs()],
  outDir: 'server/pb_public',
  prefetch: true,
  vite: {
    plugins: [million.vite({
      mode: 'preact',
      server: true,
      auto: true
    })]
  }
});