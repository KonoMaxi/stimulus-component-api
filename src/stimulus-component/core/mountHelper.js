
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
      to: async (sink) => {
        let sinkNode
        if (typeof sink === 'function') {
          sinkNode = await this._retry(sink)
        } else {
          sinkNode = sink
        }

        Array.from(docFragment.children).forEach((node) => sinkNode.appendChild(node))
      }
    }
  }

  async _retry(fn, retries=10) {
    if (retries === 0) { return null }
    const result = fn()
    if (result !== null) { return result }

    await (new Promise(resolve => setTimeout(resolve, 100)))
    return this._retry(fn, (retries - 1))    
  }
}
