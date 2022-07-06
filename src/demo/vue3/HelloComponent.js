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
    }
  },
  render() {
    return h('div', { class: "hello-component" },
    [
      h('div', `${ this.modelValue } ${ this.currentCounter }`),
      this.$slots.default ? this.$slots.default() : "",
      h('button', {
        onClick: () => { this.currentCounter += 1 },
      }, '+1'),
      h('button', {
        onClick: () => { this.updateMessage() },
      }, 'emit input event')
    ])
  }
};
