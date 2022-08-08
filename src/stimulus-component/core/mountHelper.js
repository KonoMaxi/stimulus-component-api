
export class MountHelper {

  constructor ( mountable ) {
    this.mountable = mountable
  }

  get controller () {
    return this.mountable.controller
  }

  // fetch the declared values names (minus Value at the end)
  get stimulusControllerValues () {
    if (!this.controller) { return [] }

    const stimulusValueNames = Object.entries(this.controller.valueDescriptorMap).map(entry => {
      return entry[1].name.slice(0, -5)
    })

    return stimulusValueNames
  }

  handleAction (actionPayload) {
    let fName = actionPayload
    let fParams = []
    if (typeof actionPayload == "object" && actionPayload.name) {
      fName = actionPayload.name
    }
    if (typeof actionPayload == "object" && actionPayload.parameters) {
      if (Array.isArray(actionPayload.parameters)) {
        fParams = actionPayload.parameters
      } else {
        fParams = [actionPayload.parameters]
      }
    }
    this.controller[fName](...fParams)
  }

  createChangeDetectionProxy (callback) {
    const originalFunction = this.controller.context.valueObserver.stringMapValueChanged
    this.controller.context.valueObserver.stringMapValueChanged = (...args) => {
      callback(args[1])
      return Reflect.apply(originalFunction, this.controller.context.valueObserver, args)
    }
  }

  checkMountPointDefined() {
    if (!this.mountable.mountPoint) {
      console.debug(`setting mountpoint to controller element`)
      this.mountable.mountPoint = this.controller.element
    }
  }

  transferChildNodes(origin, optionalCallback) {
    const docFragment = new DocumentFragment()
    Array.from(origin.children).forEach((node) => docFragment.appendChild(node))

    if (optionalCallback) {
      optionalCallback()
    }

    return {
      to: (sink) => {
        Array.from(docFragment.children).forEach((node) => sink.appendChild(node))
      }
    }
  }

}
