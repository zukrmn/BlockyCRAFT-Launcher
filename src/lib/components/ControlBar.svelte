<script lang="ts">
  import { ElectronService } from "../electron";
  import { i18n } from "../stores/i18n.svelte";


  let {
    username = $bindable(""),
    isLaunching = false,
    isGameRunning = false,
    handleLaunch,
    handleClose
  } = $props();

  async function handleDonate() {
    await ElectronService.openExternal("https://craft.blocky.com.br/donate/");
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Enter" && username.trim()) {
      handleLaunch();
    }
  }
</script>

<div class="control-bar">
  <!-- Donate Button -->
  <button class="btn-donate" onclick={handleDonate}>
    {i18n.t("ui.donate")}
  </button>

  <!-- Username Input -->
  <div class="input-wrapper">
    <input
      type="text"
      bind:value={username}
      placeholder={i18n.t("ui.username_placeholder")}
      onkeydown={onKey}
      disabled={isLaunching || isGameRunning}
    />
  </div>

  <!-- Play / Loading / Close -->
  {#if isLaunching}
    <div class="loading-wrapper">
      <img src="loading.gif" alt="Loading" class="loading-anim" />
    </div>
  {:else if isGameRunning}
    <button class="btn-close" onclick={handleClose}>
      {i18n.t("ui.close")}
    </button>
  {:else}
    <button
      class="btn-play"
      onclick={handleLaunch}
      disabled={!username.trim()}
    >
      {i18n.t("ui.play")}
    </button>
  {/if}
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



  .btn-play {
    background: white;
    color: black;
    min-width: 100px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Pulse animation for Play button */
  @keyframes pulse-white {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }

  /* Shine animation */
  @keyframes shine {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: -200% center;
    }
  }

  /* Pulse animation for Donate button (Gold) */
  @keyframes pulse-gold {
    0% {
      box-shadow: 0 0 0 0 rgba(191, 149, 63, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(191, 149, 63, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(191, 149, 63, 0);
    }
  }

  .btn-donate {
    /* Golden Gradient with Shine Animation - Cyclic for seamless loop */
    background: linear-gradient(
      to right, 
      #bf953f 0%, 
      #fcf6ba 40%,
      #ffffff 50%,
      #fcf6ba 60%,
      #bf953f 100%
    );
    background-size: 200% auto;
    animation: shine 2s linear infinite;
    
    color: #5c4010; /* Darker Gold/Brown text for contrast against bright shine */
    text-shadow: 0 1px 0 rgba(255,255,255, 0.4);
    font-weight: 800; /* Extra bold for better visibility */
    
    min-width: 100px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-donate:hover {
    transform: translateY(-2px) scale(1.05);
    /* Keep animation running, maybe brighter filter? */
    filter: brightness(1.1);
    box-shadow: 0 4px 12px rgba(191, 149, 63, 0.4);
    /* Add pulse on hover too */
    animation: shine 2s linear infinite, pulse-gold 1.5s infinite;
  }

  .btn-play:not(:disabled):hover {
    animation: pulse-white 1.5s infinite;
    transform: translateY(-2px) scale(1.05);
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
  }

  .input-wrapper {
    /* Auto margins push siblings to edges in Flexbox */
    margin: 0 auto;
    width: 200px; /* Fixed smaller width */
    display: flex;
    position: relative;
    z-index: 10;
  }

  input {
    width: 100%;
    background: transparent;
    border: 1px solid var(--color-primary);
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

  input:disabled {
    background: rgba(0, 0, 0, 0.3);
    color: #666;
    cursor: not-allowed;
    border-color: #222;
  }
  .loading-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px; /* Consumes same space roughly or fixed width to prevent layout shift */
  }

  .loading-anim {
    height: 120px;
    width: auto;
    object-fit: contain;
  }

  .btn-close {
    background: #ef4444; /* Red color */
    color: white;
    border: none;
    padding: 0 var(--spacing-lg);
    min-width: 100px;
    height: 100%;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 600;
    text-transform: uppercase;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .btn-close:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }

</style>
