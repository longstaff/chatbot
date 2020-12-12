<script>
  import Main from "./Main.svelte";
  import SignUp from "./SignUp.svelte";
  import { setClient } from "svelte-apollo";
  import client from "./createClient";

  setClient(client);

  let user;
  const setUser = (setUser) => {
    user = setUser;
  };
</script>

<style>
  :global(body) {
    --interactive: green;
    --interactive-hover: darkgreen;
    --interactive-contrast: white;
    --border-radius: 5px;
  }

  .wrapper {
    box-sizing: border-box;
    height: 100%;
  }
</style>

<div class="wrapper">
  {#if user && user.name}
    <Main {user} />
  {:else}
    <SignUp {setUser} />
  {/if}
</div>
