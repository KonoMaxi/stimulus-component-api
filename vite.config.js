import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/stimulus-component/index.js'),
      name: 'StimulusComponentApi',
      // the proper extensions will be added
      fileName: 'stimulus-component-api'
    }
  }
})
