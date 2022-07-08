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

    // console.log(HelloComponentClass.prototype.isReactComponent)
    // console.log(HelloComponentHook.prototype.isReactComponent)

    // this.component = () => {
    //   return React.createElement(HelloComponentClass, {
    //     onChange: _this._synchronizeStateToStimulus.bind(_this),
    //     counter: _this.counterValue,
    //     text: _this.textValue
    //   })
    // }
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
    console.log(`counterValueChanged(${newVal})`)
  }

  increment () {
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