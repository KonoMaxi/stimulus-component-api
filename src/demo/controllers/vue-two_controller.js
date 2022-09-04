import { Controller } from "@hotwired/stimulus"
import HelloComponent from '../vue2/HelloComponent'

import { Vue2Component } from "../../stimulus-component"
import Vue from 'vue2'

Vue2Component.setFactory(Vue)

export default class extends Controller {
  static targets = [ "mountpoint", "messagebox", "message" ]
  static values = { value: String, counter: Number }

  initialize() {
    this.maunt = new Vue2Component(HelloComponent, this.mountpointTarget)
    this.maunt.createApp(this)
  }

  connect() {}

  mount() {
    this.maunt.mount()
    console.log(this.maunt.app)
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
    msg.setAttribute("data-vue-two-target", "message")
    msg.textContent = `Received a message from Vue with parameters "${some}" and "${param}"`
    this.messageboxTarget.appendChild(msg)
  }

  messageTargetConnected(target) {
    setTimeout(() => target.remove(), 3000)
  }
}