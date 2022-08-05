<script>
	export let text = "default Message"
  export let counter = 0

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

	function increaseCounter() {
		counter += 1;
    dispatch('stateChange', { counter })
	}
</script>

<div>
  <div class="hello-component">
    <div>{text} {counter}</div>
    <button on:click={increaseCounter}>
      +1
    </button>
    <button on:click={() => dispatch('action', { name: "debug" })}>Call Debug</button>
    <button on:click={() => dispatch('action', { name: "debug", parameters: [ "hello" ]})}>Call Debug with param</button>
    <button on:click={() => dispatch('stateChange', { text: "value was emitted" })}>
      emit input event
    </button>
  </div>
</div>
