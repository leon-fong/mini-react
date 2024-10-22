import { defineConfig } from 'vite';


export default defineConfig({
  esbuild: {
    jsxInject: `import * as MiniReact from "mini-react"`,
    jsxFactory: 'MiniReact.createElement',
    jsxFragment: 'Fragment'
  }
})
