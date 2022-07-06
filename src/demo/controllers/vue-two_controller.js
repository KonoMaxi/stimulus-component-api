import { Controller } from "@hotwired/stimulus"
import HelloComponent from '../vue2/HelloComponent'

import { Vue2Component } from "../../stimulus-component"
import Vue from 'vue2'

Vue2Component.setFactory(Vue)

export default class extends Controller {
  static targets = [ "mountpoint", "output" ]
  static values = { value: String, counter: Number }

  initialize() {
    console.log("stimulus - initialize")
    this.maunt = new Vue2Component(HelloComponent, this.mountpointTarget)
    this.maunt.createApp(this)
  }

  connect() {
    console.log("stimulus - connect")
  }

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

  updateText(event) {
    this.messageValue = event.target.value
    if (this.messageValue.length === 0) {
      this.outputTarget.innerHTML = ""
    } else {
      this.outputTarget.innerHTML = `Hello, ${this.messageValue}!`
    }
  }
}