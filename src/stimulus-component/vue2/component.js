import { MountHelper } from "../core/mountHelper"

export class Vue2Component {

  setFactory(factory) {
    this.factory = factory
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
      
      if ( this._isMounted && this.app ) {
        this.app[valueNameUnsuffixed] = this.controller[valueName]
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

    this.syntheticMountPoint = document.createElement("div")
    this.originalMountPoint.appendChild(this.syntheticMountPoint)

    const vueComponentProps = Object.keys(this.mountableComponent.props)

    // get intersection of vue props and stimulus values
    let propertiesToSync = vueComponentProps.filter(x => this.stimulusControllerValues.includes(x))

    this.app = new this.factory({
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
        const propagateChanges = function (controller, valueName) {
          return {
            [valueName === 'value' ? 'input' : `update:${valueName}`]: function (value) {
              controller[`${valueName}Value`] = value
            }
          }
        }
        
        return h(
          _this.mountableComponent, {
            props: Object.assign(
              {},
              ...vueComponentProps.map(name => {
                return { [name]: this[name] }
              })
            ),
            on: Object.assign(
              {
                action: function (payload) {
                  _this.mountHelper.handleAction(payload)
                }
              },
              ...propertiesToSync.map(name => propagateChanges(_this.controller, name))
            )
          },
          [
            h("div", { class: 'stimulus-component-slot-content'})
          ]
        )
      }
    })
    this.app.$mount(this.syntheticMountPoint)
    this.syntheticMountPoint = this.app.$el

    transfer.to(this.syntheticMountPoint.querySelector('.stimulus-component-slot-content'))
    this._isMounted = true
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    this.mountHelper.transferChildNodes(this.syntheticMountPoint.querySelector('.stimulus-component-slot-content'), () => {
      this.app.$destroy()
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