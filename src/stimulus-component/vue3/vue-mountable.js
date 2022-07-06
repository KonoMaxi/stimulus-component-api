export class Vue3MountableLegacy {
  constructor(mountable, mountPoint) {
    this.originalMountPoint = mountPoint
    this.mountable  = mountable
    this._isMounted = false
  }

  initialize (controller) {
    this.controller = controller

    if (!this.originalMountPoint) {
      console.debug(`setting mountpoint to controller element`)
      this.originalMountPoint = controller.element
    }
  }

  mount () {
    const _this = this
    if (this._isMounted) { return }

    const frag = document.createDocumentFragment()
    const originalInnerHtml = this.originalMountPoint.innerHTML
    this.originalMountPoint.innerHTML = ''

    this.syntheticMountPoint = document.createElement("div")
    this.originalMountPoint.appendChild(this.syntheticMountPoint)

    const mountProps = Object.keys(this.mountable.props)
    // fetch the declared values names (minus Value at the end)
    const stimulusControllerValues = Object.entries(this.controller.valueDescriptorMap).map(entry => { return entry[1].name.slice(0, -5) })

    // get intersection of vue props and stimulus values
    let propertiesToSync = mountProps.filter(x => stimulusControllerValues.includes(x))

    const VueModule = Vue3MountableRegistry.get()
    console.log(this.originalMountPoint, this.syntheticMountPoint)

    this.mounted = VueModule.createApp({
      name: `${ this.controller.identifier }-controller-${ this.mountable.name ? this.mountable.name + '-' : '' }mountable`,
      data: () => {
        return Object.assign(
          {},
          ...propertiesToSync.map((name) => {
            return { [name]: this.controller[`${name}Value`] }
          })
        )
      },
      render: () => {
        return VueModule.h(
          _this.mountable, {
            props: Object.assign(
              {},
              ...propertiesToSync.map(name => {
                return { [name]: this[name] }
              })
            ),
            on: Object.assign(
              {},
              ...propertiesToSync.map((valueName) => {
                return {
                  [`update:${valueName}`]: function (value) {
                    controller[`${valueName}Value`] = value
                  }
                }        
              })
            )
          },
          [
            // I use the `slot` option to tell in which slot I want to render this.
            // <template> vue pseudo element that won't be actually rendered in the end.
            VueModule.h('div', { domProps: { innerHTML: originalInnerHtml } })
          ]
        )
      }
    })
    this.mounted.mount(this.syntheticMountPoint)
    this.syntheticMountPoint = this.mounted._component
    this._isMounted = true
  }

  unmount () {
    if ( !this._isMounted ) { return }

    const slotContent = this.mounted.$children[0].$slots.default[0].elm.innerHTML
    this.mounted.$destroy()
    this.syntheticMountPoint.remove()
    this.originalMountPoint.innerHTML = slotContent
    this._isMounted = false
  }
}
