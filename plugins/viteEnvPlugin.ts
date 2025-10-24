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

  return {
    name: "vite:vite-env-plugin",
    enforce: "post",
    configResolved(config) {
      const viteEnv = loadEnv(config.mode, config.root, "VITE_");
      const nextPublicEnv = loadEnv(config.mode, config.root, "NEXT_PUBLIC_");

      // Handle potentially undefined values
      const nodeEnv = process.env.NODE_ENV || "development";
      const mode = config.mode || "development";

      stub = `
if (typeof window !== 'undefined') {
  const $vite = ${JSON.stringify(viteEnv)};
  const $public = ${JSON.stringify(nextPublicEnv)};
  globalThis.process ??= {};
  const base = globalThis.process.env ?? {};
  const $runtime = { NODE_ENV: "${nodeEnv}", MODE: "${mode}" };
  globalThis.process.env = new Proxy(Object.assign({}, $runtime, $vite, $public, base), {
    get(t, p) { return p in t ? t[p] : undefined; },
    has(t, p) { return p in t; }
  });
}
`;
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
