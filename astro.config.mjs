import million from 'million/compiler';
import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  outDir: 'server/pb_public',
  vite: {
    plugins: [million.vite({ mode: 'preact', server: true, auto: true })]
  }
})