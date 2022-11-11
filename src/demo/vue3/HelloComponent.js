import { h } from 'vue3'

export default {
  name: 'Vue3Hello',
  props: {
    text: {
      type: String,
      default: "default Message"
    },
    counter: {
      type: Number,
      default: 0
    }
  },
  computed: {
    currentCounter: {
      get () { return this.counter },
      set (newValue) {
        this.$emit("update:counter", newValue)
      }
    }
  },
  methods: {
    updateMessage() {
      if (this.text === "Poly") {
        this.$emit("update:text", "Ester")
      } else {
        this.$emit("update:text", "Poly")
      }
    },
    emitAction() {
      this.$emit("action", { name: "sendMessage", parameters: [this.text, this.counter]})
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
