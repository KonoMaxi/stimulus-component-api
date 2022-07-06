<template>
  <div class="hello-component">
    <div>{{ message }} {{ currentCounter }}</div>
    <slot />
    <button @click="currentCounter++">Inc</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "default Message"
    },
    counter: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      currentCounter: 0
    }
  },
  watch: {
    currentCounter (newValue) {
      this.$emit("update:counter", newValue)
    }
  },
  mounted () {
    this.currentCounter = this.counter
  }
}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
