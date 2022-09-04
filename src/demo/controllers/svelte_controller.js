import { Controller } from "@hotwired/stimulus"

import HelloComponent from '../svelte/Hello.svelte'
import { SvelteComponent } from "../../stimulus-component"

export default class extends Controller {
  static targets = [ "mount", "messagebox", "message" ]
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

  sendMessage( some, param ) {
    const msg = document.createElement('p')
    msg.setAttribute("data-svelte-target", "message")
    if ( !some && !param ) {
      msg.textContent = `Received a message from Svelte but no parameters were provided`
    } else {
      msg.textContent = `Received a message from Svelte with parameters "${some}" and "${param}"`
    }
    this.messageboxTarget.appendChild(msg)
  }

  messageTargetConnected(target) {
    setTimeout(() => target.remove(), 3000)
  }

}