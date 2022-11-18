# Stimulus-Component-API

The stimulus-component-api allows the developer to mount Vue.JS- and React-Components.

The API's adaptors handle:
1. State Synchronisation between Component-Props and Stimulus-Value-Api
2. Mounting Components when a stimulus-target enters the dom.
3. Destruction of the component when either the stimulus-target leaves the dom or the controller is destroyed.
4. Communication Interface to call Controller-Actions from the component.

## Installation
Add the Package to your package.json e.g. via `npm i stimulus-compoment-api` or `yarn add stimulus-compoment-api`


## configuring the components
Add a component-defintion to the `static components` array.

Please note that `stimulus-component-api` does not ship with any vue or react code! You have to provide references to their `factoryFunction` and `renderFunction`.

```
import { createApp, h } from 'vue'
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

import HelloWorldVue from '../vue/HelloComponent'
import HelloWorldReact from '../react/HelloComponent'

import { useComponents } from "stimulus-component-api"

export default class extends Controller {

  static targets = [ "hellovue", "helloreact" ]

  static values = { message: String }

  static components = [{
    type: 'vue',
    component: HelloWorldVue,
    target: 'hellovue',
    factoryFunction: createApp,
    renderFunction: h,
  }, {
    type: 'react',
    component: HelloWorldReact,
    target: 'helloreact',
    factoryFunction: createRoot,
    renderFunction: createElement
  }]

  initialize() {
    useComponents(this)
  }
}
```

## State
You want to use your controllers values in your component? No Problem!

Access to the `message` value of this controller is simple:
```
export default class extends Controller {
  static values = { message: String }
}
```

Vue and React will receive the values as props!

To bubble up any changes back to stimulus, your can use the conventional ways for change propagation:

Vue: `this.$emit("message:update", "Changed Message Value")`

React:
```
export default function HelloComponent({ message, onChange }) {
  render(
    <button
      onClick={() => onChange({ message: "Hello" })}
    >
      Say Hello
    </button>
}
```

## Actions
You want to call controller code from within a component? No Problem!


To call the `sendMessage` action in this controller:
```
export default class extends Controller {
  sendMessage(message) {
    console.log(`The message is "${message}"`)
  }
}
```

All you have to do is using one of the following methods for your framework:

Vue 2: `this.$emit("action", { name: "sendMessage", parameters: ["Hello from Vue"]})`

Vue 3: `ctx.emit("action", { name: "sendMessage", parameters: ["Hello from Vue"]})`

In React:
```
export default function HelloComponent({ message, onAction }) {
  useEffect(() => {
    onAction({
      name: "sendMessage",
      parameters: ["Hello from React"],
    })
  }, [message])
  render(<p>{ message }</p>)
}
```


## Registering plugins in Vue 3
Vue3 allows you to register plugins AFTER app creation. In case that's necessary, you can provide a callback that is executed after the component is created, but before it is mounted.


```
import { createApp, h } from 'vue'
import { coolPlugin } from 'cool-vue-plugin'

import { useComponents } from "stimulus-component-api"

import HelloWorldVue from '../vue/HelloComponent'

export default class extends Controller {
  static targets = [ "hellovue" ]

  static components = [{
    type: 'vue',
    component: HelloWorldVue,
    target: 'hellovue',
    factoryFunction: createApp,
    renderFunction: h,
    callbackFunction (app) {
      app.use(coolPlugin)
    }
  }]

  initialize() {
    useComponents(this)
  }
}
```