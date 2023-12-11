/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PB_HOST: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}