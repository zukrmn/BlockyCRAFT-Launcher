<script lang="ts">
  import { onMount } from "svelte";
  import { ElectronService } from "./lib/electron";
  import Button from "./lib/components/Button.svelte";
  import TextInput from "./lib/components/TextInput.svelte";
  import ProgressBar from "./lib/components/ProgressBar.svelte";

  // State using Svelte 5 runes
  let username = $state("");
  let isLaunching = $state(false);
  let launchStatus = $state("");
  let launchProgress = $state(0);
  let isCustomInstance = $state(false);
  let updateAvailable = $state(false);
  let updateVersion = $state("");

  onMount(async () => {
    isCustomInstance = await ElectronService.checkCustomInstance();
    const update = await ElectronService.checkForUpdates();
    if (update.available) {
      updateAvailable = true;
      updateVersion = update.version || "";
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

    // Load saved username if any (could integrate localstorage later)
    if (localStorage.getItem("username")) {
      username = localStorage.getItem("username") || "";
    }
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

  async function handleUpdate() {
    isLaunching = true;
    launchStatus = "Atualizando...";
    const result = await ElectronService.performUpdate();
    if (result.success) {
      updateAvailable = false;
      alert("Atualizado com sucesso! Reinicie se necerrário.");
    } else {
      alert("Falha na atualização.");
      isLaunching = false;
    }
  }
</script>

<main class="app-container">
  <div class="glass-card">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <span class="blocky">Blocky</span><span class="craft">CRAFT</span>
      </div>
      <div class="subtitle">Beta 1.7.3 Edition</div>

      {#if isCustomInstance}
        <div class="badge">✨ Custom Instance</div>
      {/if}
    </header>

    <!-- Content -->
    <div class="content">
      {#if updateAvailable}
        <div class="update-banner">
          <p>Nova versão <strong>{updateVersion}</strong> disponível!</p>
          <Button
            variant="secondary"
            onclick={handleUpdate}
            disabled={isLaunching}
          >
            Atualizar Agora
          </Button>
        </div>
      {/if}

      <div class="form-group">
        <TextInput
          bind:value={username}
          label="Nome de Usuário"
          placeholder="Ex: Steve"
          type="text"
          onkeypress={(e) => e.key === "Enter" && handleLaunch()}
        />
      </div>

      {#if isLaunching}
        <div class="progress-area">
          <ProgressBar progress={launchProgress} status={launchStatus} />
        </div>
      {:else}
        <Button
          variant="primary"
          class="play-btn"
          onclick={handleLaunch}
          disabled={!username.trim()}
        >
          JOGAR
        </Button>
      {/if}
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>Desenvolvido com ❤️ pela comunidade</p>
      {#if updateVersion}
        <p class="version">v{updateVersion}</p>
      {/if}
    </footer>
  </div>
</main>

<style>
  .app-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow: hidden;
  }

  .glass-card {
    width: 100%;
    max-width: 420px;
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glass);
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header {
    text-align: center;
  }

  .logo {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .blocky {
    color: var(--color-emerald);
  }
  .craft {
    color: white;
  }

  .subtitle {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .badge {
    display: inline-block;
    background: rgba(255, 215, 0, 0.1);
    color: #ffd700;
    font-size: 0.75rem;
    padding: 4px 12px;
    border-radius: 20px;
    margin-top: 1rem;
    border: 1px solid rgba(255, 215, 0, 0.2);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .update-banner {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 1rem;
    border-radius: var(--radius-md);
    text-align: center;
    font-size: 0.9rem;
    color: #ffd700;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.play-btn) {
    width: 100%;
    height: 3.5rem;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
  }

  .footer {
    text-align: center;
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin-top: auto;
  }

  .progress-area {
    min-height: 3.5rem; /* Reserve space to match button height */
    display: flex;
    align-items: center;
  }
</style>
