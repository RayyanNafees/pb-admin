/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PB_URL: string
  readonly PUBLIC_GITHUB_TOKEN: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}