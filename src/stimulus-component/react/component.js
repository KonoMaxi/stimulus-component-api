import { MountHelper } from "../core/mountHelper"

export class ReactComponent {

  static setFactory(factory) {
    this.factory = factory
  }
  static getFactory() {
    return this.factory
  }
  static setRenderFunction(r) {
    this.renderFunction = r
  }
  static getRenderFunction() {
    return this.renderFunction
  }

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
        if ( this._isClassComponent) {
          this.mountedComponentRef.setState({
            ...this.mountedComponentRef.state,
            [valueNameUnsuffixed]: this.controller[valueName]
          })  
        }
        this._renderComponent()
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
    this.reactRoot = this.constructor.factory(this.mountPoint)

    const transfer = this.mountHelper.transferChildNodes(this.mountPoint)  
    this._renderComponent()
    // react does not render immediately
    setTimeout(() => transfer.to(this.mountPoint.querySelector('.stimulus-component-slot-content')))

    this._isMounted = true
  }

  _renderComponent () {
    const _this = this

    const reactProps = Object.assign(
      {
        onChange: (payload) => {
          if ( payload && typeof payload === 'object') {
            Object.keys(payload).forEach((key) => {
              _this.controller[`${key}Value`] = payload[key]
            })
          }
          if (_this._isClassComponent && _this.mountedComponentRef) {
            _this.stimulusControllerValues.forEach((val) => {
              _this.controller[`${val}Value`] = _this.mountedComponentRef.state[val]
            })
          }
        },
        onAction: (payload) => {
          this.mountHelper.handleAction(payload)
        },
        ...this.otherProperties
      },
      ..._this.stimulusControllerValues.map((name) => {
        return { [name]: _this.controller[`${name}Value`] }
      })
    )
    
    const stimulusComponentSlotContentPlaceholder = this.constructor.renderFunction("div", { className: "stimulus-component-slot-content" })

    if (this._isClassComponent) {
      this.reactRoot.render(
        this.constructor.renderFunction(
          this.mountableComponent,
          {
            ...reactProps,
            ref: ref => _this.mountedComponentRef = ref,
          },
          stimulusComponentSlotContentPlaceholder
        )
      )
    } else { // functional component
      this.reactRoot.render(
        this.constructor.renderFunction(
          this.mountableComponent,
          reactProps,
          stimulusComponentSlotContentPlaceholder
        )
      )
    }
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    this.mountHelper.transferChildNodes(this.mountPoint.querySelector('.stimulus-component-slot-content'), () => {
      this.reactRoot.unmount()
    }).to(this.mountPoint)
    this._isMounted = false
  }

  setProperty(name, value) {
    const lowerCaseName = name.toLowerCase()
    if ( name !== lowerCaseName ) console.warn("react does not like upper-case letters in prop names!")
    this.otherProperties[lowerCaseName] = value
  }

  getProperty(name) {
    const lowerCaseName = name.toLowerCase()
    if ( name !== lowerCaseName ) console.warn("react does not like upper-case letters in prop names!")
    return this.otherProperties[lowerCaseName]
  }
}