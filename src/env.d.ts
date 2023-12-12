/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PB_HOST: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}