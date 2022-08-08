import { MountHelper } from "../core/mountHelper"

export class SvelteComponent {

  static setFactory(factory) { }
  static getFactory() { }
  static setRenderFunction(r) { }
  static getRenderFunction() { }

  _isMounted = false
  app = undefined

  constructor(mountableComponent, mountPoint, customProps) {
    this._isClassComponent = mountableComponent.prototype.isReactComponent
    this.mountableComponent = mountableComponent
    this.mountPoint = mountPoint
    this.otherProperties = customProps || {}
    this.mountHelper = new MountHelper(this)
  }

  get stimulusControllerValues () {
    return this.mountHelper.stimulusControllerValues
  }

  createApp(controller) {
    this.controller = controller
    this.mountHelper.createChangeDetectionProxy((valueName) => {
      const valueNameUnsuffixed = valueName.slice(0, -5)
      if ( this._isMounted ) {
        this.app.$set({ [valueNameUnsuffixed]: this.controller[valueName] })
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
    const transfer = this.mountHelper.transferChildNodes(this.mountPoint)

    this.app = new this.mountableComponent({
      target: this.mountPoint,
      props: Object.assign(
        {},
        ...this.stimulusControllerValues.map((name) => {
          return { [name]: this.controller[`${name}Value`] }
        }),
        this.otherProperties
      )
    })
    this.app.$on("stateChange", event => {
      Object.entries(event.detail).forEach(([attKey, attValue]) => {
        this.controller[`${attKey}Value`] = attValue
      })
    })
    this.app.$on("action", event => {
      this.mountHelper.handleAction(event.detail)
    })

    transfer.to(this.mountPoint.querySelector('.stimulus-component-slot-content'))

    this._isMounted = true
    return this.app
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    this.mountHelper.transferChildNodes(this.mountPoint.querySelector('.stimulus-component-slot-content'), () => {
      this.app.$destroy()
    }).to(this.mountPoint)

    this._isMounted = false
  }

  setProperty(name, value) {
    this.otherProperties[name] = value

    if(this._isMounted) {
      this.app.$set({ [name]: value })
    }
  }

  getProperty(name) {
    return this.otherProperties[name]
  }
}