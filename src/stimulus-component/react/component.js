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
    this.originalMountPoint = this.mountPoint

    this.originalInnerHTML = this.mountHelper.extractOriginalContent()
    this._renderComponent()

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
    
    let domChildren = []
    if ( this.originalInnerHTML ) {
      domChildren = this.constructor.renderFunction("div", { className: "stimulus-component-inner-html", key: "innerHtml", dangerouslySetInnerHTML: {__html: this.originalInnerHTML } })
    }

    if (this._isClassComponent) {
      this.reactRoot.render(
        this.constructor.renderFunction(
          this.mountableComponent,
          {
            ...reactProps,
            ref: ref => _this.mountedComponentRef = ref,
          },
          domChildren
        )
      )
    } else { // functional component
      this.reactRoot.render(
        this.constructor.renderFunction(
          this.mountableComponent,
          reactProps,
          domChildren
        )
      )
    }
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    let slotContent
    if ( this.originalInnerHTML ) {
      const childrenContainer = this.originalMountPoint.querySelector(".stimulus-component-inner-html")
      if (childrenContainer) {
        slotContent = childrenContainer.innerHTML
      }
      delete this.originalInnerHTML
    }
    this.reactRoot.unmount()
    this.originalMountPoint.innerHTML = slotContent
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