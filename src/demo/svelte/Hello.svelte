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

<div class="hello-component">
  <h4>Hello from Svelte</h4>
  <div>{text} {counter}</div>
  <div class="stimulus-component-slot-content" style="border: solid 1px black; padding: 10px"/>
  <button on:click={increaseCounter}>
    Svelte +1
  </button>
  <button on:click={() => {
      let newText = "beep"
      if ( text === "beep" ) { newText = "boop" }
      dispatch('stateChange', { text: newText })
    }
  }>
    change text-message
  </button>
  <button on:click={() => dispatch('action', { name: "sendMessage" })}>Call Stimulus action without params</button>
  <button on:click={() => dispatch('action', { name: "sendMessage", parameters: [ text, counter ]})}>Call Stimulus action with params</button>
</div>