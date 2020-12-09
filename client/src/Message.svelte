<script>
  export let log;
</script>

<style>
  .log {
    display: flex;
    flex-direction: row;
  }
  .user {
    font-weight: bold;
    margin-right: 8px;
  }
  .message {
    flex-grow: 1;
  }
</style>

<div class="log">
  <p class="user">{log.user.name}:</p>
  <p class="message">{log.message}</p>
</div>
