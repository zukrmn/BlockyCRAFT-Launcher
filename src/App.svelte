<script lang="ts">
  import { onMount } from "svelte";
  import { ElectronService } from "./lib/electron";
  import ControlBar from "./lib/components/ControlBar.svelte";
  import ChangelogPanel from "./lib/components/ChangelogPanel.svelte";
  import DonatorsPanel from "./lib/components/DonatorsPanel.svelte";
  import "./styles/theme.css";

  // State
  let username = $state("");
  let isLaunching = $state(false);
  let launchStatus = $state("");
  let launchProgress = $state(0);

  onMount(async () => {
    // Load saved username
    if (localStorage.getItem("username")) {
      username = localStorage.getItem("username") || "";
    }

    ElectronService.onProgress((status, progress) => {
      launchStatus = status;
      launchProgress = progress;
      if (progress === 100) {
        setTimeout(() => {
          isLaunching = false;
        }, 1500);
      }
    });

    // Check for updates silently in background (optional, feature preserved)
    ElectronService.checkForUpdates();
  });

  async function handleLaunch() {
    if (!username.trim()) return;
    localStorage.setItem("username", username);

    isLaunching = true;
    launchStatus = "Iniciando...";
    launchProgress = 0;

    const result = await ElectronService.launchGame(username);
    if (!result.success) {
      isLaunching = false;
      alert("Erro ao iniciar: " + result.error);
    }
  }
</script>

<main class="app-layout">
  <div class="content-grid">
    <!-- Left: Changelog -->
    <div class="panel-area changelog-area">
      <ChangelogPanel />
    </div>

    <!-- Right: Donators -->
    <div class="panel-area donators-area">
      <DonatorsPanel />
    </div>
  </div>

  <!-- Bottom: Control Bar -->
  <footer class="footer-bar">
    <ControlBar 
      bind:username 
      {isLaunching} 
      {handleLaunch} 
    />
    
    {#if isLaunching}
      <div class="status-overlay">
        <div class="status-text">{launchStatus} ({launchProgress}%)</div>
      </div>
    {/if}
  </footer>
</main>

<style>
  :global(body) {
    background-color: var(--color-bg-dark);
  }

  .app-layout {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: var(--spacing-lg);
    gap: var(--spacing-lg);
  }

  .content-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1.5fr 1fr; /* Changelog wider than donators */
    gap: var(--spacing-lg);
    min-height: 0; /* Important for scroll */
  }

  .panel-area {
    min-height: 0;
    height: 100%;
  }



  .footer-bar {
    position: relative;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
  }

  .status-overlay {
    position: absolute;
    top: -30px;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .status-text {
    background: rgba(0, 0, 0, 0.8);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
    color: var(--color-primary);
  }
</style>
