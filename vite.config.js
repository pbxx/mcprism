import { fileURLToPath, URL } from 'node:url'
const path = require("path");

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
console.log(__dirname)
export default defineConfig({
  //base: path.resolve(__dirname, "./vuedist/"),
  base: '',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'vuedist'),
    //outDir: '../vuedist',
  }
})