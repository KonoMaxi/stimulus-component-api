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
    // render App component and show it on screen
    // const props = {
    //   count: 10
    // }

    class Wrapper extends React.Component {
      constructor(props) {
        super(props)
      }
  
      render () {
        return React.createElement(
          HelloComponentClass,
          {
            ref: ref => _this.componentRef = ref,
            onChange: () => {
              _this._synchronizeStateToStimulus()
            },
            counter: _this.counterValue,
            text: _this.textValue
          }
        )
      }
    }  

    this.component = React.createElement(Wrapper)
  }

  connect () {
    // this.polling = true
  }

  _synchronizeStateToStimulus () {
    this.counterValue = this.componentRef.state.counter
    this.valueValue = this.componentRef.state.value
  }

  _synchronizeStateToReact () {
    this.componentRef.setState({counter: this.counterValue})
  }

  mount () {
    this.reactRoot = createRoot(this.mountpointTarget)
    this.reactRoot.render(this.component)
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
}