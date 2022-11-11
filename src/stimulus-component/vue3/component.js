import { MountHelper } from "../core/mountHelper"

const propagateChanges = function (controller, valueName) {
  return {
    [`onUpdate:${valueName}`]: function (value) {
      controller[`${valueName}Value`] = value
    }
  }
}

export class Vue3Component {

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
      
      if ( this._isMounted && this.vueRoot ) {
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

    this.originalMountPoint = this.controller[`${this.target}Target`]
    const transfer = this.mountHelper.transferChildNodes(this.originalMountPoint)

    // const innerHTML = this.mountHelper.extractOriginalContent()
    this.syntheticMountPoint = document.createElement("div")
    this.originalMountPoint.appendChild(this.syntheticMountPoint)

    const vueComponentProps = Object.keys(this.mountableComponent.props)
    
    // get intersection of vue props and stimulus values
    let propertiesToSync = vueComponentProps.filter(x => this.stimulusControllerValues.includes(x))

    this.app = this.factory({
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
          {
            onAction: function (payload) {
              _this.mountHelper.handleAction(payload)
            }
          },
          ...vueComponentProps.map(name => {
            return { [name]: this[name] }
          }),
          ...propertiesToSync.map(name => propagateChanges(_this.controller, name))
        )
        const vnode = _this.renderFunction(
          _this.mountableComponent, props, () => [
            _this.renderFunction('div', {class: 'stimulus-component-slot-content'})
          ]
        )
        return vnode
      }
    })
    this.vueRoot = this.app.mount(this.syntheticMountPoint)

    transfer.to(this.syntheticMountPoint.querySelector('.stimulus-component-slot-content'))
    this.syntheticMountPoint = this.app._container
    this._isMounted = true
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    this.mountHelper.transferChildNodes(this.syntheticMountPoint.querySelector('.stimulus-component-slot-content'), () => {
      this.app.unmount()
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