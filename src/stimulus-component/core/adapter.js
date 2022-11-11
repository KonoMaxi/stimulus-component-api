import { compute_slots } from "svelte/internal";
import { ReactComponent, Vue2Component, Vue3Component } from "../../stimulus-component"

const mountComponent = (controller, componentDefinition) => {
  let m;
  if (componentDefinition.type.toLowerCase() === 'vue') {
    if (componentDefinition.renderFunction === undefined) {
      m = new Vue2Component(componentDefinition.component, componentDefinition.target)
    } else {
      m = new Vue3Component(componentDefinition.component, componentDefinition.target)
      m.setRenderFunction(componentDefinition.renderFunction)
    }
  } else if (componentDefinition.type.toLowerCase() === 'react') {
    m = new ReactComponent(componentDefinition.component, componentDefinition.target)
    m.setRenderFunction(componentDefinition.renderFunction)
  } else {
    return undefined
  }
  m.setFactory(componentDefinition.factoryFunction)
  m.createApp(controller)
componentDefinition.reference = m  

  return m
}

const useComponents = (controller) => {
  const controllerDisconnect = controller.disconnect.bind(controller)
  const controllerConnect = controller.connect.bind(controller)

  const components = controller.constructor.components.map((componentDefinition) => {
    return mountComponent(controller, componentDefinition)
  })

  Object.assign(controller, {
    connect() {
      components.forEach(c => c.mount())
      controllerConnect()
    },
    disconnect() {
      controllerDisconnect()
      components.forEach(c => c.mount())
    }
  })
}

export default useComponents