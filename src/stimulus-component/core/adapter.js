import { compute_slots } from "svelte/internal";
import { ReactComponent, VueComponent } from "../../stimulus-component"

const mountComponent = (controller, componentDefinition) => {
  let m;
  if (componentDefinition.type.toLowerCase() === 'vue') {
    m = new VueComponent(componentDefinition.component, componentDefinition.target)
  } else if (componentDefinition.type.toLowerCase() === 'react') {
    m = new ReactComponent(componentDefinition.component, componentDefinition.target)
  } else {
    return undefined
  }
  m.setRenderFunction(componentDefinition.renderFunction)
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
      components.forEach(c => c.unmount())
    }
  })
}

export default useComponents