import { type Plugin, loadEnv } from "vite";

/**
 * Makes `process.env` safe on the **client** only.
 *   • VITE_* keys get their literal values.
 *   • NEXT_PUBLIC_* keys get their literal values.
 *   • Every other key returns `undefined`.
 * Server / SSR code is untouched.
 */
export function viteEnvPlugin(): Plugin {
  let stub = "";
  function makeStub(v: Record<string, string>, p: Record<string, string>) {
    return `
if (typeof window !== 'undefined') {
  const $vite = ${JSON.stringify(v)};
  const $public = ${JSON.stringify(p)};
  globalThis.process ??= {};
  const base = globalThis.process.env ?? {};
  const $runtime = { NODE_ENV: ${JSON.stringify(process.env.NODE_ENV ?? "development")}, MODE: ${JSON.stringify(process.env.NODE_ENV ?? "development")} };
  globalThis.process.env = new Proxy(Object.assign({}, $runtime, $vite, $public, base), {
    get(t: Record<string, string>, q: string) { return q in t ? t[q] : undefined; },
    has(t: Record<string, string>, q: string) { return q in t; }
  });
}
`;
  }

  return {
    name: "vite:vite-env-plugin",
    enforce: "post",
    configResolved(config) {
      const v = loadEnv(config.mode, config.root, "VITE_");
      const p = loadEnv(config.mode, config.root, "NEXT_PUBLIC_");
      stub = makeStub(v, p);
    },
    /** Inject the stub at the top of every JS/TS module compiled for the browser. */
    transform(code, id, opts) {
      if (opts?.ssr) return null; // server/SSR build → leave untouched
      if (!/\.[cm]?[jt]sx?$/.test(id)) return null; // ignore non-JS modules
      if (code.includes("globalThis.process ??=")) return null; // already injected
      return { code: stub + code, map: null };
    },
  };
}
