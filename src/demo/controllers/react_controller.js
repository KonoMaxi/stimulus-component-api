import { Controller } from "@hotwired/stimulus"
import HelloComponentHook from "../react/HelloComponentHook"
import HelloComponentClass from "../react/HelloComponentClass"

import { ReactComponent } from "../../stimulus-component"
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

ReactComponent.setFactory(createRoot)
ReactComponent.setRenderFunction(createElement)

export default class extends Controller {
  static targets = [ "class", "hook" ]
  static values = { unused: String,  text: String, counter: Number }

  initialize () {
    console.log("stimulus - initialize")
    this.mauntClass = new ReactComponent(HelloComponentClass, this.classTarget)
    this.mauntHook = new ReactComponent(HelloComponentHook, this.hookTarget)
    this.mauntClass.createApp(this)
    this.mauntHook.createApp(this)
  }

  connect () { }

  mount () {
    this.mauntClass.mount()
    this.mauntHook.mount()
  }

  unmount () {
    this.mauntClass.unmount()
    this.mauntHook.unmount()
  }
  counterValueChanged (newVal) {
    console.log(`react controller: counterValueChanged(${newVal})`)
  }

  increment () {
    if (!this.mauntClass.getProperty("myprop")) {
      this.mauntClass.setProperty("myprop", "surprise!")
      this.mauntHook.setProperty("myprop", "surprise!")
    } else {
      this.mauntClass.setProperty("myprop", undefined)
      this.mauntHook.setProperty("myprop", undefined)
    }
    
    this.counterValue = this.counterValue + 1
  }

  updateText (event) {
    this.modelValueValue = event.target.value
    if (this.modelValueValue.length === 0) {
      this.outputTarget.innerHTML = ""
    } else {
      this.outputTarget.innerHTML = `Hello, ${this.textValue}!`
    }
  }
}