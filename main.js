import { Application } from '@hotwired/stimulus'
import { registerControllers } from 'stimulus-vite-helpers'

const application = Application.start()
const controllers = import.meta.globEager('./**/*_controller.js')
registerControllers(application, controllers)

// import { createApp } from 'vue3'
// import HelloComponent from './src/demo/vue3/HelloComponent'

// const app = createApp(HelloComponent)
// app.mount('#app')
