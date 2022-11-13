export class VueTwoWrapper {
  data = {} // == app

  constructor(factory, controller, mountableComponent, mountHelper) {
    console.log(mountableComponent)
    const vueComponentProps = Object.keys(mountableComponent.props)

    // get intersection of vue props and stimulus values
    let propertiesToSync = vueComponentProps.filter(x => mountHelper.stimulusControllerValues.includes(x))

    this.data = new factory({
      name: `${ controller.identifier }-controller-${ mountableComponent.name ? mountableComponent.name + '-' : '' }mountable`,
      data: () => {
        return Object.assign(
          {},
          ...vueComponentProps.map((name) => {
            return { [name]: controller[`${name}Value`] }
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
          mountableComponent, {
            props: Object.assign(
              {},
              ...vueComponentProps.map(name => {
                return { [name]: this[name] }
              })
            ),
            on: Object.assign(
              {
                action: function (payload) {
                  mountHelper.handleAction(payload)
                }
              },
              ...propertiesToSync.map(name => propagateChanges(controller, name))
            )
          },
          [
            h("div", { class: 'stimulus-component-slot-content'})
          ]
        )
      }
    })
  }

  mount(mountpoint) {
    this.data.$mount(mountpoint)
    return this.data.$el
  }

  unmount() {
    this.data.$destroy()
  }
}