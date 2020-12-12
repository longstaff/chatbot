<script>
  export let setRoom;
  export let active;
</script>

<button data-testid="roomList" on:click={() => setRoom('room')}>
  Room List
</button>
