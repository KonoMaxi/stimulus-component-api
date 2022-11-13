export class VueThreeWrapper {
  data = {} // == vueRoot

  constructor(factory, renderFn, controller, mountableComponent, mountHelper) {
    const vueComponentProps = Object.keys(mountableComponent.props)
    
    // get intersection of vue props and stimulus values
    let propertiesToSync = vueComponentProps.filter(x => mountHelper.stimulusControllerValues.includes(x))

    this.app = factory({
      name: `${ controller.identifier }-controller-${ mountableComponent.name ? mountableComponent.name + '-' : '' }mountable`,
      data: () => {
        return Object.assign(
          {},
          ...vueComponentProps.map((name) => {
            return { [name]: controller[`${name}Value`] }
          })
        )
      },
      render: function () {
        const propagateChanges = function (controller, valueName) {
          return {
            [`onUpdate:${valueName}`]: function (value) {
              controller[`${valueName}Value`] = value
            }
          }
        }
        
        const props = Object.assign(
          {
            onAction: function (payload) {
              mountHelper.handleAction(payload)
            }
          },
          ...vueComponentProps.map(name => {
            return { [name]: this[name] }
          }),
          ...propertiesToSync.map(name => propagateChanges(controller, name))
        )
        const vnode = renderFn(
          mountableComponent, props, () => [
            renderFn('div', {class: 'stimulus-component-slot-content'})
          ]
        )
        return vnode
      }
    })
  }

  mount (mountpoint) {
    this.data = this.app.mount(mountpoint)
    return this.app._container
  }

  unmount () {
    this.app.unmount()
  }
}
