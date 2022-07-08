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

  constructor(mountableComponent, mountPoint) {
    this._isClassComponent = mountableComponent.prototype.isReactComponent
    this.mountableComponent = mountableComponent
    this.mountPoint = mountPoint
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
        // this.app._.data[valueNameUnsuffixed] = this.controller[valueName]
        // this.vueRoot[valueNameUnsuffixed] = this.controller[valueName]
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

    // const innerHTML = this.mountHelper.extractOriginalContent()
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
        }
      },
      ..._this.stimulusControllerValues.map((name) => {
        return { [name]: _this.controller[`${name}Value`] }
      })
    )
    if (this._isClassComponent) {
      this.reactRoot.render(
        this.constructor.renderFunction(
          this.mountableComponent,
          {
            ...reactProps,
            ref: ref => _this.mountedComponentRef = ref,
          }
        )
      )
    } else { // functional component
      this.reactRoot.render(
        this.constructor.renderFunction(
          this.mountableComponent,
          reactProps
        )
      )
    }
  }

  unmount() {
    if ( !this._isMounted ) {
      console.warn(`already unmounted`)
      return
    }

    // let slotContent
    // if (this.app._instance.subTree.children[0]) {
    //   slotContent = this.app._instance.subTree.children[0].el.innerHTML
    // }
    this.reactRoot.unmount()
    // this.mountHelper.restoreOriginalContent(slotContent)
    this._isMounted = false
  }

  setProperty(name, value) {
    this.app[name] = value
  }

  getProperty(name) {
    return this.app[name]
  }
}