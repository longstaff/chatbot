<script>
  import { query } from "svelte-apollo";
  import { GET_CHANNELS } from "./queries";

  export let active;
  export let setRoom;

  let roomList = query(GET_CHANNELS);
</script>

<style>
  .wrapper {
    height: 100%;
  }
  .room-list {
    box-sizing: border-box;
    padding: 1rem 0.5rem;
    margin: 0;
    list-style: none;
    border-right: 1px solid #ccc;
    height: 100%;
    width: 10rem;
  }
  .room-item {
    margin: 0.25rem 0;
  }
  .room-link {
    color: var(--interactive);
    display: block;
    border-radius: 3px;
    padding: 0.25rem;
  }
  .room-link:hover,
  .room-link.active {
    color: var(--interactive-hover);
    background: #eee;
    text-decoration: none;
  }
</style>

<div class="wrapper">
  {#if $roomList.loading}
    <li>Loading...</li>
  {:else if $roomList.error}
    <li>ERROR: {$roomList.error.message}</li>
  {:else if $roomList.data}
    <ul class="room-list">
      {#each $roomList.data.channelList as room (room.id)}
        <li class="room-item">
          <a
            class={`room-link ${room === active ? 'active' : ''}`}
            href={room.id}
            on:click|preventDefault={() => setRoom(room.id)}>{room.name}</a>
        </li>
      {/each}
    </ul>
  {:else}
    <li>No channels found</li>
  {/if}
</div>
