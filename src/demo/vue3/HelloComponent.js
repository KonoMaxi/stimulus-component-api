import { computed, h } from 'vue3'

export default {
  name: 'Vue3Hello',
  props: {
    counter: {
      type: Number,
      default: 0
    },
    text: {
      type: String,
      default: "default Message"
    }
  }, // props: ["counter", "text"] Works too
  emits: ["update:counter", "update:text", "action"],
  setup(props, ctx) {
    const currentCounter = computed({
      get () { return props.counter },
      set (newValue) {
        ctx.emit("update:counter", newValue)
      }
    })

    function updateMessage() {
      if (props.text === "Poly") {
        ctx.emit("update:text", "Ester")
      } else {
        ctx.emit("update:text", "Poly")
      }
    }

    function emitAction() {
      ctx.emit("action", { name: "sendMessage", parameters: [props.text, props.counter]})
    }

    // expose to template and other options API hooks
    return {
      props, currentCounter, emitAction, updateMessage
    }
  },
  
  render() {
    return h('div', { class: "hello-component" },
    [
      h('h4', 'Hello from Vue 3'),
      h('div', `${ this.text } ${ this.currentCounter }`),
      h('div', { style: "border: solid 1px black; padding: 10px" }, this.$slots.default ? this.$slots.default() : ""),
      h('button', {
        onClick: () => { this.currentCounter += 1 },
      }, 'Vue +1'),
      h('button', {
        onClick: () => { this.updateMessage() },
      }, 'change text-message'),
      h('button', {
        onClick: () => { this.emitAction() },
      }, 'call stimulus action')
    ])
  }
};
