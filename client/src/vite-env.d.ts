declare module "*.svg" {
  const Component: React.FC<React.SVGProps<SVGElement>>;
  export default Component;
}

// Must come after "*.svg" module.
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
