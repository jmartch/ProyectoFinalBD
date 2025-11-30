/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // otras vars que tengas:
  // readonly VITE_OTRA_COSA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}