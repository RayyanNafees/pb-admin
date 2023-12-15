/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PB_URL: string
  readonly PUBLIC_GITHUB_TOKEN: string
  readonly PUBLIC_GITHUB_OAUTH_CLIENT_ID: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}