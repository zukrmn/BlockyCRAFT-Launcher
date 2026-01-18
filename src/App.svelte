<script lang="ts">
  import { onMount } from "svelte";
  import { ElectronService } from "./lib/electron";
  import ControlBar from "./lib/components/ControlBar.svelte";
  import ChangelogPanel from "./lib/components/ChangelogPanel.svelte";
  import DonatorsPanel from "./lib/components/DonatorsPanel.svelte";
  import LanguageToggle from "./lib/components/LanguageToggle.svelte";
  import SettingsModal from "./lib/components/SettingsModal.svelte";
  import TutorialButton from "./lib/components/TutorialButton.svelte";
  import { i18n } from "./lib/stores/i18n.svelte";
  import "./styles/theme.css";


  // State
  let username = $state("");
  let isLaunching = $state(false);
  let isGameRunning = $state(false);
  let launchStatus = $state("");
  let launchProgress = $state(0);
  let maxProgress = $state(0); // Never decreases - ensures bar doesn't go backwards


  // Map backend status messages (in Portuguese) to i18n keys
  const statusMap: Record<string, string> = {
    "Verificando atualizações...": "status.checkingUpdates",
    "Verificando Java...": "status.checkingJava",
    "Baixando Java...": "status.downloadingJava",
    "Instalando Java...": "status.installingJava",
    "Verificando versão...": "status.checkingVersion",
    "Baixando bibliotecas...": "status.downloadingLibraries",
    "Baixando nativos...": "status.downloadingNatives",
    "Configurando Fabric/StationAPI...": "status.configuringFabric",
    "Iniciando Jogo...": "status.startingGame",
  };

  function translateStatus(status: string): string {
    // Check for exact match first
    if (statusMap[status]) {
      return i18n.t(statusMap[status]);
    }
    // Check for "Baixando X..." pattern (downloading files)
    if (status.startsWith("Baixando ")) {
      const filename = status.replace("Baixando ", "").replace("...", "");
      return `${i18n.t("status.downloading")} ${filename}...`;
    }
    // Return original if no translation found
    return status;
  }

  onMount(async () => {
    // Load saved username
    if (localStorage.getItem("username")) {
      username = localStorage.getItem("username") || "";
    }

    ElectronService.onProgress((status, progress) => {
      launchStatus = translateStatus(status);
      launchProgress = progress;
      // Ensure progress never decreases (prevents bar from going backwards)
      if (progress > maxProgress) {
        maxProgress = progress;
      }
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
    maxProgress = 0; // Reset max progress on new launch

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
        <SettingsModal />
      </div>
      <div class="panel-area donators-area">
        <DonatorsPanel />
      </div>
      <!-- Tutorial Button -->
      <TutorialButton />
    </div>
  </div>

  <!-- Bottom: Control Bar -->
  <footer class="footer-bar" class:launching={isLaunching}>
    <!-- Status text and progress bar that replaces the divider line when launching -->
    {#if isLaunching}
      <div class="progress-status">{launchStatus}</div>
      <div class="progress-line">
        <div class="progress-fill" style="width: {maxProgress}%"></div>
      </div>
    {/if}
    
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
    justify-content: flex-end;
    gap: var(--spacing-sm);
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

  /* Hide border when launching (progress bar takes over) */
  .footer-bar.launching {
    border-top-color: transparent;
  }

  /* Thin green neon progress bar */
  .progress-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(34, 197, 94, 0.15);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #4ade80);
    box-shadow: 
      0 0 10px #22c55e,
      0 0 20px #22c55e,
      0 0 30px rgba(34, 197, 94, 0.5);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Discrete status text above progress bar */
  .progress-status {
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 0.7rem;
    color: var(--color-text-muted);
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 var(--spacing-lg);
  }

</style>
