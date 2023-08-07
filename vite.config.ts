import { defineConfig } from "vite";
import dts from "vite-plugin-dts"
import { resolve } from "path"

export default () => {
  return defineConfig({
    plugins: [
      dts()
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'index',
        fileName: 'index'
      },
      rollupOptions: {
        external: ['pinia'],
      },
    }
  })
}