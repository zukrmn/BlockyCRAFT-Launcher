<script lang="ts">
  import { onMount } from "svelte";
  import { ElectronService } from "./lib/electron";
  import ControlBar from "./lib/components/ControlBar.svelte";
  import ChangelogPanel from "./lib/components/ChangelogPanel.svelte";
  import DonatorsPanel from "./lib/components/DonatorsPanel.svelte";
  import LanguageToggle from "./lib/components/LanguageToggle.svelte";
  import { i18n } from "./lib/stores/i18n.svelte";
  import "./styles/theme.css";


  // State
  let username = $state("");
  let isLaunching = $state(false);
  let isGameRunning = $state(false);
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
    });

    // Check for updates silently in background (optional, feature preserved)
    ElectronService.checkForUpdates();
  });

  async function handleLaunch() {
    if (!username.trim()) return;
    localStorage.setItem("username", username);

    isLaunching = true;
    launchStatus = i18n.t("status.launching");
    launchProgress = 0;

    const result = await ElectronService.launchGame(username);
    if (!result.success) {
      isLaunching = false;
      alert(i18n.t("status.error") + result.error);
    }
  }

  // Listen for game events
  $effect(() => {
    ElectronService.onGameConnected(() => {
        isLaunching = false;
        isGameRunning = true;
    });

    ElectronService.onGameClosed(() => {
      isLaunching = false;
      isGameRunning = false;
      launchStatus = "";
      launchProgress = 0;
    });
  });

</script>

<main class="app-layout">
  <div class="content-grid">
    <!-- Left: Changelog -->
    <div class="panel-area changelog-area">
      <ChangelogPanel />
    </div>

    <!-- Right: Donators + Language -->
    <div class="right-column">
      <div class="lang-area">
        <LanguageToggle />
      </div>
      <div class="panel-area donators-area">
        <DonatorsPanel />
      </div>
    </div>
  </div>

  <!-- Bottom: Control Bar -->
  <footer class="footer-bar">
    <ControlBar 
      bind:username 
      {isLaunching}
      {isGameRunning}
      {handleLaunch}
      handleClose={ElectronService.killGame}
    />
    

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

  .right-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    height: 100%;
    min-height: 0;
  }

  .lang-area {
    display: flex;
    justify-content: flex-end; /* Align to right? Or left? "Above Apoiadores" implies standard flow, maybe right aligned looks better contextually */
  }

  .panel-area {
    min-height: 0;
    height: 100%;
  }
  
  /* Make donators area fill remaining space in right column */
  .donators-area {
    flex: 1;
  }

  .footer-bar {
    position: relative;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
    margin-left: calc(-1 * var(--spacing-lg));
    margin-right: calc(-1 * var(--spacing-lg));
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }


</style>
