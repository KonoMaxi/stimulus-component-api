import { Controller } from "@hotwired/stimulus"
import HelloComponentHook from "../react/HelloComponentHook"
import HelloComponentClass from "../react/HelloComponentClass"
import React from 'react';
import { createRoot } from 'react-dom/client';

export default class extends Controller {
  static targets = [ "mountpoint", "output" ]
  static values = { text: String, counter: Number }

  initialize () {
    const _this = this

    this.component = React.createElement(
      HelloComponentClass,
      {
        onChange: () => {
          _this._synchronizeStateToStimulus()
        },
        ref: ref => _this.componentRef = ref,
        counter: _this.counterValue,
        text: _this.textValue
      }
    )
    console.log(HelloComponentClass)
    console.log(this.component)
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

  connect () {
    // this.polling = true
  }

  mount () {
    const _this = this
    this.reactRoot.render(this.component)
    // this.reactRoot.render(this.component())

    if ( this.polling ) {
      this.updateInterval = setInterval(() => {
        this._synchronizeStateToStimulus()
      }, 500)
    }
  }

  unmount () {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this._synchronizeStateToStimulus()
    this.reactRoot.unmount()
  }
  // counterValueChanged (newVal) {
  //   console.log(`counter ${newVal}`)
  // }

  increment () {
    this.counterValue = this.counterValue + 1
    this._synchronizeStateToReact()
  }
  updateText (event) {
    this.modelValueValue = event.target.value
    if (this.modelValueValue.length === 0) {
      this.outputTarget.innerHTML = ""
    } else {
      this.outputTarget.innerHTML = `Hello, ${this.textValue}!`
    }
  }

  _synchronizeStateToStimulus (payload) {
    console.log("synchronize to stimulus", payload)
    // Object.keys(payload).forEach((key) => {
    //   this[`${key}Value`] = payload[key]
    // })
    // this._synchronizeStateToReact()

    this.counterValue = this.componentRef.state.counter
    this.textValue = this.componentRef.state.text
  }

  _synchronizeStateToReact () {
    console.log("synchronize to react")
    // this.reactRoot.render(this.component())

    this.componentRef.setState({counter: this.counterValue, text: this.textValue})
  }
}