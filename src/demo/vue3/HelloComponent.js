import { h } from 'vue3'

export default {
  name: 'Vue3Hello',
  props: {
    modelValue: {
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
      this.$emit("update:modelValue", "input was emitted")
    },
    emitAction() {
      this.$emit("action", { name: "debugVue", parameters: ["hi", "you"]})
    }
  },
  
  render() {
    return h('div', { class: "hello-component" },
    [
      h('div', `${ this.modelValue } ${ this.currentCounter }`),
      h('div', { style: "border: solid 1px black; padding: 10px" }, this.$slots.default ? this.$slots.default() : ""),
      h('button', {
        onClick: () => { this.currentCounter += 1 },
      }, '+1'),
      h('button', {
        onClick: () => { this.updateMessage() },
      }, 'emit input event'),
      h('button', {
        onClick: () => { this.emitAction() },
      }, 'trigger Action')
    ])
  }
};
