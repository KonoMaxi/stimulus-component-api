import { Controller } from "@hotwired/stimulus"

import { createApp, h } from 'vue3'
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import Vue from 'vue2'

import HelloReactClass from '../react/HelloComponentClass'
import HelloReactHook from '../react/HelloComponentHook'
import HelloVue2 from '../vue2/HelloComponent'
import HelloVue3 from '../vue3/HelloComponent'

import useComponents from '../../stimulus-component/core/adapter'

export default class extends Controller {
  static components = [{
    type: 'vue',
    component: HelloVue2,
    target: 'vuetwo',
    factoryFunction: Vue
  }, {
    type: 'vue',
    component: HelloVue3,
    target: 'vuethree',
    factoryFunction: createApp,
    renderFunction: h
  }, {
    type: 'react',
    component: HelloReactClass,
    target: 'reactClass',
    factoryFunction: createRoot,
    renderFunction: createElement
  }, {
    type: 'react',
    component: HelloReactHook,
    target: 'reactHook',
    factoryFunction: createRoot,
    renderFunction: createElement
  }]
  static targets = [ "vuetwo", "vuethree", "reactClass", "reactHook", "messagebox", "message" ]
  static values = { text: String, counter: Number }

  initialize() {
    useComponents(this)
  }

  counterValueChanged(newVal) {
    console.log(`counter ${newVal}`)
  }

  increment() {
    this.counterValue = this.counterValue + 1
  }

  sendMessage( some, param ) {
    const msg = document.createElement('p')
    msg.setAttribute("data-vue-three-target", "message")
    msg.textContent = `Received a message from Vue with parameters "${some}" and "${param}"`
    this.messageboxTarget.appendChild(msg)
  }

  messageTargetConnected(target) {
    setTimeout(() => target.remove(), 3000)
  }
}