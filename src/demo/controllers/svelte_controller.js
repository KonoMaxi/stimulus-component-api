import { Controller } from "@hotwired/stimulus"

import Hello from '../svelte/Hello.svelte'
import { MountHelper } from '../../stimulus-component/core/mountHelper'

export default class extends Controller {
  static targets = [ "mount" ]
  static values = { unused: String, text: String, counter: Number }

  initialize () {
    console.log("stimulus - initialize")
  }

  connect () { }

  mount () {
    this.app = new Hello({
      target: this.mountTarget,
      props: {
        text: this.textValue,
        counter: this.counterValue
      }
    })

    const originalFunction = this.context.valueObserver.stringMapValueChanged
    this.context.valueObserver.stringMapValueChanged = (...args) => {
      this.app.$set({ [args[1].slice(0, -5)]: this[args[1]] })
      return Reflect.apply(originalFunction, this.context.valueObserver, args)
    }

    this.app.$on("stateChange", event => {
      Object.entries(event.detail).forEach(([attKey, attValue]) => {
        this[`${attKey}Value`] = attValue
      })
    })
    this.app.$on("action", event => {
      let fName = event.detail
      let fParams = []
      if (typeof event.detail == "object" && event.detail.name) {
        fName = event.detail.name
      }
      if (typeof event.detail == "object" && event.detail.parameters) {
        if (Array.isArray(event.detail.parameters)) {
          fParams = event.detail.parameters
        } else {
          fParams = [event.detail.parameters]
        }
      }
      this[fName](...fParams)
    })
  }

  unmount () {
    this.app.$destroy()
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