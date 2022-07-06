import { MountHelper } from "../core/mountHelper"

const propagateChanges = function (controller, valueName) {
  return {
    [`onUpdate:${valueName}`]: function (value) {
      controller[`${valueName}Value`] = value
    }
  }
}

export class Vue3Component {

  static setFactory(factory) {
    this.factory = factory
  }
  static getFactory() {
    return this.factory
  }

  _isMounted = false
  app = undefined

  constructor(mountableComponent, mountPoint) {
    this.mountableComponent = mountableComponent
    this.originalMountPoint = mountPoint
    this.mountHelper = new MountHelper(this)
  }

  get stimulusControllerValues () {
    return this.mountHelper.stimulusControllerValues
  }

  createApp(controller) {
    this.controller = controller
    this.mountHelper.createChangeDetectionProxy((valueName) => {
      console.log("vue3 detected")
      const valueNameUnsuffixed = valueName.slice(0, -5)
      
      // TODO vue3 way for 
      if ( this.vueRoot && Object.keys(this.vueRoot).includes(valueNameUnsuffixed) ) {
        // this.app._.data[valueNameUnsuffixed] = this.controller[valueName]
        this.vueRoot[valueNameUnsuffixed] = this.controller[valueName]
      }
    })
  }
  
  mount() {
    // preventing double-mount
    if (this._isMounted) { 
      console.warn(`already mounted`)
      return
    }
    const _this = this

    this.mountHelper.checkMountPointDefined()

    const innerHTML = this.mountHelper.extractOriginalContent()
    this.syntheticMountPoint = document.createElement("div")
    this.originalMountPoint.appendChild(this.syntheticMountPoint)


    const vueComponentProps = Object.keys(this.mountableComponent.props)
    // get intersection of vue props and stimulus values
    let propertiesToSync = vueComponentProps.filter(x => this.stimulusControllerValues.includes(x))

    // this.app = this.constructor.factory.createApp(this.mountableComponent)
    this.app = this.constructor.factory.createApp({
      name: `${ this.controller.identifier }-controller-${ this.mountableComponent.name ? this.mountableComponent.name + '-' : '' }mountable`,
      data: () => {
        return Object.assign(
          {},
          ...vueComponentProps.map((name) => {
            return { [name]: _this.controller[`${name}Value`] }
          })
        )
      },
      render: function () {
        const props = Object.assign(
          {},
          ...vueComponentProps.map(name => {
            return { [name]: this[name] }
          }),
          ...propertiesToSync.map(name => propagateChanges(_this.controller, name))
        )
        const vnode = _this.constructor.factory.h(
          _this.mountableComponent, props, [
            _this.constructor.factory.h('div', { innerHTML })
          ]
          // {
          //   default: () => 'default slot'
          // }
          // _this.constructor.factory.h('div', this.$slots.default()),
        )
        // vnode.$slots.default = innerHtml
        return vnode
      }
    })
    this.vueRoot = this.app.mount(this.syntheticMountPoint)

    console.log(this.app)
    this.syntheticMountPoint = this.app._container
    this._isMounted = true
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    let slotContent
    if (this.app._instance.subTree.children[0]) {
      slotContent = this.app._instance.subTree.children[0].el.innerHTML
    }
    this.app.unmount()
    this.mountHelper.restoreOriginalContent(slotContent)
    this._isMounted = false
  }

  setProperty(name, value) {
    this.app[name] = value
  }

  getProperty(name) {
    return this.app[name]
  }
}