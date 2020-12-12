<script>
  import Room from "./Room.svelte";
  import RoomList from "./RoomList.svelte";

  export let room = "";
  export let user;

  const setRoom = (newRoom) => {
    room = newRoom;
  };
</script>

<style>
  .main {
    display: flex;
    height: 100%;
  }
  .sidebar {
    flex-grow: 0;
  }
  .panel {
    flex-grow: 3;
  }
  .empty {
    text-align: center;
    font-size: 1.5rem;
  }
</style>

<div class="main">
  <div class="sidebar">
    <RoomList {setRoom} active={room} />
  </div>
  <div class="panel">
    {#if room}
      <Room {room} {user} />
    {:else}
      <p class="empty" data-testid="empty-title">
        Choose a room to start chatting
      </p>
    {/if}
  </div>
</div>
