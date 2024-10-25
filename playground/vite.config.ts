import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // ref: https://v2.vitejs.dev/guide/features.html#jsx
  esbuild: {
    // jsxInject: `import * as MiniReact from "mini-react"`,
    jsxFactory: "MiniReact.createElement",
    jsxFragment: "Fragment",
  },

  // ref: https://github.com/unjs/unbuild/issues/121#issuecomment-1297054276
  resolve: {
    alias: {
      "mini-react": resolve(__dirname, "./../packages/react/src/index"),
      "mini-react-dom": resolve(__dirname, "./../packages/react-dom/src/index"),
      "mini-react-reconciler": resolve(__dirname, "./../packages/react-reconciler/src/index"),
      "@mini-react/shared": resolve(__dirname, "./../packages/shared/src"),
    },
  },
});
