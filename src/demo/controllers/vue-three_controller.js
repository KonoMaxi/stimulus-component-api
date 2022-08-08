import { Controller } from "@hotwired/stimulus"
import HelloComponent from '../vue3/HelloComponent'

import { Vue3Component } from "../../stimulus-component"
import { createApp, h } from 'vue3'

Vue3Component.setFactory(createApp)
Vue3Component.setRenderFunction(h)

export default class extends Controller {
  static targets = [ "mountpoint", "output" ]
  static values = { modelValue: String, counter: Number }

  initialize() {
    console.log("stimulus - initialize")
    this.maunt = new Vue3Component(HelloComponent, this.mountpointTarget)
    this.maunt.createApp(this)
  }

  connect() {
    console.log("stimulus - connect")
  }

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

  debugVue( some, param ) {
    console.log("debug!", some, param)
  }

  updateText(event) {
    this.modelValueValue = event.target.value
    if (this.modelValueValue.length === 0) {
      this.outputTarget.innerHTML = ""
    } else {
      this.outputTarget.innerHTML = `Hello, ${this.modelValueValue}!`
    }
  }
}