
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

  createChangeDetectionProxy (callback) {
    const originalFunction = this.controller.context.valueObserver.stringMapValueChanged
    this.controller.context.valueObserver.stringMapValueChanged = (...args) => {
      callback(args[1])
      return Reflect.apply(originalFunction, this.controller.context.valueObserver, args)
    }
  }

  checkMountPointDefined() {
    if (!this.mountable.originalMountPoint) {
      console.debug(`setting mountpoint to controller element`)
      this.mountable.originalMountPoint = this.controller.element
    }
  }

  extractOriginalContent() {
    const originalInnerHtml = this.mountable.originalMountPoint.innerHTML
    this.mountable.originalMountPoint.innerHTML = ''
    return originalInnerHtml  
  }

  restoreOriginalContent(slotContent) {
    this.mountable.syntheticMountPoint.remove()
    if (slotContent) {
      this.mountable.originalMountPoint.innerHTML = slotContent
    }
  }
}
