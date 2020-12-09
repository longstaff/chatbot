<script>
  import { mutation } from "svelte-apollo";
  import { REGISTER_USER } from "./queries";
  import UserInput from "./UserInput.svelte";

  export let setUser;
  const registerUser = mutation(REGISTER_USER);

  const send = async (name) => {
    const user = await registerUser({ variables: { name } });
    setUser(user.data.registerUser);
  };
</script>

<style>
  .room {
    text-align: center;
  }
  .title {
    text-align: center;
  }
  .input {
    display: inline-block;
    max-width: 400px;
  }
</style>

<div class="room">
  <div class="title">
    <h1>Input your name</h1>
  </div>
  <div class="input">
    <UserInput submit={send} label="Submit" />
  </div>
</div>
