<script lang="ts">
  import { ElectronService } from "../electron";

  let {
    username = $bindable(""),
    isLaunching = false,
    handleLaunch,
  } = $props();

  async function handleDonate() {
    await ElectronService.openExternal("https://marina.rodrigorocha.art.br/");
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" && username.trim()) {
      handleLaunch();
    }
  }
</script>

<div class="control-bar">
  <!-- Donate Button -->
  <button class="btn-donate" onclick={handleDonate} disabled={isLaunching}>
    Donate
  </button>

  <!-- Username Input -->
  <div class="input-wrapper">
    <input
      type="text"
      bind:value={username}
      placeholder="Username"
      onkeydown={onKey}
      disabled={isLaunching}
    />
  </div>

  <!-- Play Button -->
  <button
    class="btn-play"
    onclick={handleLaunch}
    disabled={!username.trim() || isLaunching}
  >
    {#if isLaunching}
      ...
    {:else}
      Play
    {/if}
  </button>
</div>

<style>
  .control-bar {
    display: flex;
    /* justify-content: center; REMOVED */
    gap: var(--spacing-md);
    height: 50px;
    width: 100%;
  }

  button {
    border: none;
    cursor: pointer;
    font-weight: 700;
    border-radius: var(--radius-md);
    transition: filter 0.2s;
    font-size: 1rem;
    padding: 0 var(--spacing-lg);
    text-transform: uppercase;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:not(:disabled):hover {
    filter: brightness(1.1);
  }

  .btn-donate {
    background: var(--color-primary);
    color: white;
    min-width: 100px;
  }

  .btn-play {
    background: white;
    color: black;
    min-width: 100px;
  }

  .input-wrapper {
    /* Auto margins push siblings to edges in Flexbox */
    margin: 0 auto;
    width: 200px; /* Fixed smaller width */
    display: flex;
  }

  input {
    width: 100%;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: white;
    padding: 0 var(--spacing-md);
    font-size: 1rem;
    font-family: inherit;
    text-align: center;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--color-text-muted);
  }

  input::placeholder {
    color: #444;
  }
</style>
