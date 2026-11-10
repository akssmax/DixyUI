/// <reference types="vite/client" />
/// <reference types="mdx" />

/*
 * The Workers runtime module, typed for the bindings this app uses. Kept
 * minimal instead of pulling in all of @cloudflare/workers-types.
 */
declare module "cloudflare:workers" {
  interface DocsKVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  }
  export const env: {
    /** Landing-page visitor total. See src/lib/visitors.functions.ts. */
    VISITORS?: DocsKVNamespace;
  };
}
