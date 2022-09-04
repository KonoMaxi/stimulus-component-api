import { Controller } from "@hotwired/stimulus"
import HelloComponentHook from "../react/HelloComponentHook"
import HelloComponentClass from "../react/HelloComponentClass"

import { ReactComponent } from "../../stimulus-component"
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

ReactComponent.setFactory(createRoot)
ReactComponent.setRenderFunction(createElement)

export default class extends Controller {
  static targets = [ "class", "hook", "messagebox", "message" ]
  static values = { unused: String,  text: String, counter: Number }

  initialize () {
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
      if (Math.random() < 0.1) {
        this.mauntClass.setProperty("myprop", "surprise!")
        this.mauntHook.setProperty("myprop", "surprise!")  
      }
    } else {
      this.mauntClass.setProperty("myprop", undefined)
      this.mauntHook.setProperty("myprop", undefined)
    }
    
    this.counterValue = this.counterValue + 1
  }

  sendMessage ( some, param ) {
    const msg = document.createElement('p')
    msg.setAttribute("data-react-target", "message")
    msg.textContent = `Received a message from React with parameters "${some}" and "${param}"`
    this.messageboxTarget.appendChild(msg)
  }

  messageTargetConnected(target) {
    setTimeout(() => target.remove(), 3000)
  }
}