import { resolve } from 'path'
import { defineConfig } from 'vite'

import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({})],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/stimulus-component/index.js'),
      name: 'StimulusComponentApi',
      // the proper extensions will be added
      fileName: 'stimulus-component-api'
    }
  }
})
