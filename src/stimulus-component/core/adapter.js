import { ReactComponent, VueComponent } from "../../stimulus-component"

const mountComponent = (controller, componentDefinition, domTarget, domTargetAttributeName) => {
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

  
  if (domTarget[domTargetAttributeName]) {
    console.warn("You mounted a second component to a DOMNode from the same controller with an identical target-name. This causes unmount-errors.")
  }
  domTarget[domTargetAttributeName] = m
}

const useComponents = (controller) => {
  controller.constructor.components.forEach((componentDefinition) => {
    const domTargetAttributeName = `${controller.identifier}-${componentDefinition.target}-component`

    const targetConnectedCallback = `${componentDefinition.target}TargetConnected`
    const targetDisconnectedCallback = `${componentDefinition.target}TargetDisconnected`

    const originalTargetConnectedFn = controller[targetConnectedCallback]
    const originalTargetDisconnectedFn = controller[targetDisconnectedCallback]
    const originalControllerDisconnectedFn = controller.disconnect.bind(controller)

    Object.assign(controller, {
      [targetConnectedCallback]: function (target) {
        mountComponent(controller, componentDefinition, target, domTargetAttributeName)
        target[domTargetAttributeName].mount()
        if ( originalTargetConnectedFn ) {
          originalTargetConnectedFn.bind(controller)(target)
        }
      },
      [targetDisconnectedCallback]: function (target) {
        if ( originalTargetDisconnectedFn ) {
          originalTargetDisconnectedFn.bind(controller)(target)
        }
        target[domTargetAttributeName].unmount()
      },
      disconnect () {
        originalControllerDisconnectedFn()
        controller[`${componentDefinition.target}Targets`].forEach(t => t[domTargetAttributeName].unmount())
      }
    })
  
  })

}

export default useComponents