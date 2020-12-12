<script>
  export let setUser;
</script>

<button data-testid="signup" on:click={() => setUser({ name: 'name' })}>
  SignUp
</button>
