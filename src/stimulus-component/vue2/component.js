import { MountHelper } from "../core/mountHelper"

const propagateChanges = function (controller, valueName) {
  return {
    [valueName === 'value' ? 'input' : `update:${valueName}`]: function (value) {
      controller[`${valueName}Value`] = value
    }
  }
}

export class Vue2Component {

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
      console.log("vue2 detected")
      const valueNameUnsuffixed = valueName.slice(0, -5)
      
      if (this.app && Object.keys(this.app._data).includes(valueNameUnsuffixed)) {
        this.app[valueNameUnsuffixed] = this.controller[valueName]
      }
    })
    // Vue2 has a more "ad-hoc" mentality - nothing more going on around here
  }
  
  mount() {
    // preventing double-mount
    if (this._isMounted) { 
      console.warn(`already mounted`)
      return
    }
    const _this = this

    const vueComponentProps = Object.keys(this.mountableComponent.props)
    // get intersection of vue props and stimulus values
    let propertiesToSync = vueComponentProps.filter(x => this.stimulusControllerValues.includes(x))

    this.mountHelper.checkMountPointDefined()

    const innerHtml = this.mountHelper.extractOriginalContent()
    this.syntheticMountPoint = document.createElement("div")
    this.originalMountPoint.appendChild(this.syntheticMountPoint)

    this.app = new this.constructor.factory({
      name: `${ this.controller.identifier }-controller-${ this.mountableComponent.name ? this.mountableComponent.name + '-' : '' }mountable`,
      data: () => {
        return Object.assign(
          {},
          ...vueComponentProps.map((name) => {
            return { [name]: this.controller[`${name}Value`] }
          })
        )
      },
      render: function (h) {
        return h(
          _this.mountableComponent, {
            props: Object.assign(
              {},
              ...vueComponentProps.map(name => {
                return { [name]: this[name] }
              })
            ),
            on: Object.assign(
              {},
              ...propertiesToSync.map(name => propagateChanges(_this.controller, name))
            )
          }
          ,
          [
            h('div', { domProps: { innerHTML: innerHtml } })
          ]
        )
      }
    })

    this.app.$mount(this.syntheticMountPoint)
    this.syntheticMountPoint = this.app.$el
    this._isMounted = true
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    const slotContent = this.app.$children[0].$slots.default[0].elm.innerHTML
    this.app.$destroy()
    this.mountHelper.restoreOriginalContent(slotContent)
    this._isMounted = false

    // as Vue2 does not offer "unmount", we have to recreate the app in case of remount
  }

  setProperty(name, value) {
    this.app[name] = value
  }

  getProperty(name) {
    return this.app[name]
  }
}