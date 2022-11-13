import { MountHelper } from "../core/mountHelper"
import { VueTwoWrapper } from "./vueTwoWrapper"
import { VueThreeWrapper } from "./vueThreeWrapper"

export class VueComponent {

  setFactory(factory) {
    this.factory = factory
  }
  setRenderFunction(r) {
    this.renderFunction = r
  }

  _isMounted = false
  app = undefined

  constructor(mountableComponent, target) {
    this.target = target

    this.mountableComponent = mountableComponent
    this.mountHelper = new MountHelper(this)
  }

  get stimulusControllerValues () {
    return this.mountHelper.stimulusControllerValues
  }

  createApp(controller) {
    this.controller = controller
    this.mountHelper.createChangeDetectionProxy((valueName) => {
      const valueNameUnsuffixed = valueName.slice(0, -5)
      
      if ( this._isMounted && this.app.data ) {
        this.app.data[valueNameUnsuffixed] = this.controller[valueName]
      }
    })
  }
  
  mount() {
    // preventing double-mount
    if (this._isMounted) { 
      console.warn(`already mounted`)
      return
    }
    this.mountHelper.checkMountPointDefined()

    this.originalMountPoint = this.controller[`${this.target}Target`]
    const transfer = this.mountHelper.transferChildNodes(this.originalMountPoint)

    this.syntheticMountPoint = document.createElement("div")
    this.originalMountPoint.appendChild(this.syntheticMountPoint)

    if ( this.renderFunction === undefined ) {
      this.app = new VueTwoWrapper(this.factory, this.controller, this.mountableComponent, this.mountHelper)
    } else {
      this.app = new VueThreeWrapper(this.factory, this.renderFunction, this.controller, this.mountableComponent, this.mountHelper)
    }

    this.syntheticMountPoint = this.app.mount(this.syntheticMountPoint)
    transfer.to(this.syntheticMountPoint.querySelector('.stimulus-component-slot-content'))

    this._isMounted = true
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    this.mountHelper.transferChildNodes(this.syntheticMountPoint.querySelector('.stimulus-component-slot-content'), () => {
      this.app.unmount()
      this.syntheticMountPoint.remove()
    }).to(this.originalMountPoint)

    this._isMounted = false
  }

  setProperty(name, value) {
    this.app[name] = value
  }

  getProperty(name) {
    return this.app[name]
  }
}