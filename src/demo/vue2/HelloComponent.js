export default {
  name: 'Vue2Hello',
  props: {
    value: {
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
      set (newValue) { this.$emit("update:counter", newValue) }
    }
  },
  methods: {
    updateMessage() {
      this.$emit("input", "input was emitted")
    }
  },
  render(h) {
    return h('div', { class: "hello-component" },
    [
      h('div', `${ this.value } ${ this.currentCounter }`),
      h('div', { style: "border: solid 1px black; padding: 10px" }, this.$slots.default),
      h('button', {
        on: { click: () => { this.currentCounter += 1 } },
      }, '+1'),
      h('button', {
        on: { click: () => { this.updateMessage() } },
      }, 'emit input event')
    ])
  }
};
