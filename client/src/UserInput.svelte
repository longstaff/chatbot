<script>
  export let submit;
  export let label;

  let input;
  let enabled = true;

  const send = async () => {
    if (enabled && input.length) {
      enabled = false;

      try {
        await submit(input);
        input = "";
        enabled = true;
      } catch (err) {
        enabled = true;
      }
    }
  };
  export const testEnter = (ev) => {
    if (ev.key === "Enter") {
      send();
    }
  };
</script>

<style>
  .button {
    cursor: pointer;
    background: var(--interactive);
    color: var(--interactive-contrast);
    border-color: var(--interactive-hover);
    border-radius: var(--border-radius);
  }
  .button:hover {
    background: var(--interactive-hover);
  }

  .input {
    border-color: var(--interactive-hover);
    border-radius: var(--border-radius);
    width: 100%;
    margin-right: 6px;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
  }
</style>

<div class="wrapper">
  <input class="input" type="text" bind:value={input} on:keydown={testEnter} />
  <button class="button" on:click={send} disabled={!enabled}>{label}</button>
</div>
