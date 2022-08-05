import { Controller } from "@hotwired/stimulus"

import HelloComponent from '../svelte/Hello.svelte'
import { SvelteComponent } from "../../stimulus-component"

export default class extends Controller {
  static targets = [ "mount" ]
  static values = { unused: String, text: String, counter: Number }

  initialize () {
    console.log("stimulus - initialize")
    this.maunt = new SvelteComponent(HelloComponent, this.mountTarget)
    this.maunt.createApp(this)
  }

  connect () { }

  mount () {
    this.svelteApp = this.maunt.mount()
  }

  unmount () {
    this.maunt.unmount()
  }

  counterValueChanged (newVal) {
    console.log(`svelte controller: counterValueChanged(${newVal})`)
  }

  increment () {
    this.counterValue = this.counterValue + 1
  }

  debug ( someParam ) {
    console.log("debug!", someParam)
  }

  updateText (event) {
    this.textValue = event.target.value
  }
}