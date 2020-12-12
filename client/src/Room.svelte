<script>
  import { beforeUpdate, afterUpdate } from "svelte";
  import { query, mutation, subscribe } from "svelte-apollo";
  import { GET_CHANNEL, GET_LOGS, ADD_LOG, SUBSCRIBE_TO_LOGS } from "./queries";
  import Message from "./Message.svelte";
  import UserInput from "./UserInput.svelte";

  export let room;
  export let user;

  let synced = [];
  let logWrapper;
  let autoscroll = false;

  let channel = query(GET_CHANNEL, { variables: { id: room } });
  let logs = query(GET_LOGS, { variables: { id: room } });
  let logSub = subscribe(SUBSCRIBE_TO_LOGS, { variables: { id: room } });
  let addLog = mutation(ADD_LOG);

  const send = async (name) => {
    await addLog({
      variables: { channelId: room, userId: user.id, message: name },
    });
  };

  $: {
    logs.refetch({ id: room });
    channel.refetch({ id: room });
    logSub = subscribe(SUBSCRIBE_TO_LOGS, { variables: { id: room } });
    synced = [];
  }
  $: {
    if ($logSub.data && $logSub.data.channelLog) {
      synced = synced.concat([$logSub.data.channelLog]);
    }
  }

  beforeUpdate(() => {
    autoscroll =
      logWrapper &&
      logWrapper.offsetHeight + logWrapper.scrollTop >
        logWrapper.scrollHeight - 20;
  });

  afterUpdate(() => {
    if (autoscroll) logWrapper.scrollTo(0, logWrapper.scrollHeight);
  });
</script>

<style>
  .room {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 1rem;
  }
  .log {
    flex-grow: 1;
    overflow-y: auto;
  }
  .input {
    flex-grow: 0;
  }

  h1 {
    margin: 0;
  }
</style>

<div class="room">
  <div class="title">
    <h1 data-testid="room-name">
      {`Room: ${$channel.data && $channel.data.channel.name}`}
    </h1>
  </div>
  <div class="log" bind:this={logWrapper}>
    {#if $logs.loading}
      <li data-testid="loading-state">Loading...</li>
    {:else if $logs.error}
      <li>ERROR: {$logs.error.message}</li>
    {:else if $logs.data && $logs.data.channelLog.length}
      {#each $logs.data.channelLog as log (log.id)}
        <Message {log} />
      {/each}
    {:else if !synced.length}
      <p data-testid="empty-state">No messages yet, say something</p>
    {/if}

    {#each synced as log (log.id)}
      <Message {log} />
    {/each}
  </div>
  <div class="input">
    <UserInput submit={send} label="Submit" />
  </div>
</div>
