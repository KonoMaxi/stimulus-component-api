import { Controller } from "@hotwired/stimulus"
import HelloComponent from '../vue3/HelloComponent'

import { Vue3Component } from "../../stimulus-component"
import { createApp, h } from 'vue3'

Vue3Component.setFactory(createApp)
Vue3Component.setRenderFunction(h)

export default class extends Controller {
  static targets = [ "mountpoint", "messagebox", "message" ]
  static values = { modelValue: String, counter: Number }

  initialize() {
    this.maunt = new Vue3Component(HelloComponent, this.mountpointTarget)
    this.maunt.createApp(this)
  }

  connect() {}

  mount() {
    this.maunt.mount()
  }

  unmount() {
    this.maunt.unmount()
  }

  counterValueChanged(newVal) {
    console.log(`counter ${newVal}`)
  }

  increment() {
    this.counterValue = this.counterValue + 1
  }

  sendMessage( some, param ) {
    const msg = document.createElement('p')
    msg.setAttribute("data-vue-three-target", "message")
    msg.textContent = `Received a message from Vue with parameters "${some}" and "${param}"`
    this.messageboxTarget.appendChild(msg)
  }

  messageTargetConnected(target) {
    setTimeout(() => target.remove(), 3000)
  }
}