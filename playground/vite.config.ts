import { defineConfig } from "vite";

// ref: https://v2.vitejs.dev/guide/features.html#jsx

export default defineConfig({
  esbuild: {
    jsxInject: `import * as MiniReact from "mini-react"`,
    jsxFactory: "MiniReact.createElement",
    jsxFragment: "Fragment",
  },
});
