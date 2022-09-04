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
      if (this.value === "Marco") {
        this.$emit("input", "Polo")
      } else {
        this.$emit("input", "Marco")
      }
    }
  },
  render(h) {
    return h('div', { class: "hello-component" },
    [
      h('h4', "Hello from Vue v2!"),
      h('div', `${ this.value } ${ this.currentCounter }`),
      h('div', { style: "border: solid 1px black; padding: 10px" }, this.$slots.default),
      h('button', {
        on: { click: () => { this.currentCounter += 1 } },
      }, 'Vue +1'),
      h('button', {
        on: { click: () => { this.updateMessage() } },
      }, 'change text-message'),
      h('button', {
        on: { click: () => { this.$emit("action", { name: "sendMessage", parameters: [this.value, this.counter]}) } },
      }, 'call stimulus action')
    ])
  }
};
