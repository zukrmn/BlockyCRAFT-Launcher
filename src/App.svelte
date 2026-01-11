<script lang="ts">
  import { onMount } from 'svelte';

  let username = $state('');
  let isLaunching = $state(false);
  let launchStatus = $state('');
  let launchProgress = $state(0);
  let isCustomInstance = $state(false);
  
  // Interface for Electron API
  interface ElectronAPI {
    send: (channel: string, data: any) => void;
    receive: (channel: string, callback: (...args: any[]) => void) => void;
    invoke: (channel: string, data: any) => Promise<any>;
  }

  const electron = (window as any).electronAPI as ElectronAPI;

  let updateAvailable = $state(false);
  let updateVersion = $state('');

  onMount(async () => {
    if (electron) {
      // Check for custom instance
      isCustomInstance = await electron.invoke('check-custom-instance', null);
      
      // Check for Updates
      try {
          const updateStatus = await electron.invoke('check-update-status', null);
          if (updateStatus && updateStatus.available) {
              updateAvailable = true;
              updateVersion = updateStatus.version;
          }
      } catch (e) {
          console.error('Update check failed:', e);
      }

      electron.receive('launch-progress', (data: any) => {
        launchStatus = data.status;
        launchProgress = data.progress;
        
        if (data.progress === 100) {
           setTimeout(() => {
             isLaunching = false;
             launchStatus = '';
             launchProgress = 0;
             // If we just finished an update, hide the button? Or reload? 
             // Ideally we should reload the app or re-check.
             if (launchStatus.includes('Atualização concluída')) {
                 updateAvailable = false;
                 alert('Atualização concluída com sucesso! Clique em JOGAR.');
             }
           }, 2000);
        }
      });
    }
  });
  
  async function handleUpdate() {
      if (isLaunching) return;
      isLaunching = true;
      launchStatus = 'Iniciando atualização...';
      launchProgress = 0;
      
      try {
          const result = await electron.invoke('perform-update', null);
          if (!result || !result.success) {
               isLaunching = false;
               alert(`Erro na atualização: ${result?.error}`);
          } else {
              // Validated via progress events mostly
              updateAvailable = false;
          }
      } catch (e) {
          isLaunching = false;
          alert(`Erro: ${e}`);
      }
  }

  async function handlePlay() {
    if (!username.trim()) {
      alert('Por favor, insira um nome de usuário!');
      return;
    }
    
    if (isLaunching) return;

    isLaunching = true;
    launchStatus = 'Iniciando...';
    launchProgress = 0;
    
    console.log('Launching game for:', username);
    
    if (electron) {
      // Use invoke to get result waiting
      const result = await electron.invoke('launch-game', { username });
      // Note: We used ipcMain.handle, so use invoke.
      if (!result || !result.success) {
         isLaunching = false;
         console.error('Launch Result Error:', result);
         alert(`Erro ao iniciar: ${result?.error || 'Desconhecido'}\n\nDetalhes: ${result?.stack || ''}`);
      }
    } else {
      // Mock for browser dev
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        launchProgress = p;
        launchStatus = `Baixando arquivos... ${p}%`;
        if (p >= 100) {
          clearInterval(interval);
          launchStatus = 'Pronto (Modo Demo Browser)';
          setTimeout(() => isLaunching = false, 2000);
        }
      }, 500);
    }
  }
</script>

<main class="launcher">
  <div class="launcher-card">
    <div class="logo-section">
      <h1 class="logo-text">
        <span class="logo-blocky">Blocky</span><span class="logo-craft">CRAFT</span>
      </h1>
      <p class="version-text">Minecraft Beta 1.7.3</p>
      {#if isCustomInstance}
        <div class="custom-badge">
          ✨ Instance Customizada Detectada
        </div>
      {/if}
      
      {#if updateAvailable}
         <button class="update-badge" onclick={handleUpdate} disabled={isLaunching}>
            🚀 Atualização v{updateVersion} Disponível! (Clique para instalar)
         </button>
      {/if}
    </div>

    <div class="input-section">
      <label for="username" class="input-label">Nome de Usuário</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        placeholder="Digite seu username..."
        class="username-input"
        maxlength="16"
      />
    </div>

    <button 
      class="play-button"
      onclick={handlePlay}
      disabled={!username.trim() || isLaunching}
    >
      {isLaunching ? (launchStatus.includes('atualização') ? 'ATUALIZANDO...' : 'CARREGANDO...') : 'JOGAR'}
    </button>

    {#if isLaunching}
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {launchProgress}%"></div>
        </div>
        <p class="status-text">{launchStatus}</p>
      </div>
    {/if}

    <p class="footer-text">
      Feito com ❤️ para a comunidade
    </p>
  </div>
</main>

<style>
  .launcher {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
    padding: 1rem;
  }

  .launcher-card {
    background: rgba(15, 15, 15, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 3rem 2.5rem;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .logo-section {
    text-align: center;
  }

  .logo-text {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  .logo-blocky {
    color: #10b981;
  }

  .logo-craft {
    color: #ffffff;
  }

  .version-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
  }

  .custom-badge {
    background: rgba(255, 215, 0, 0.15);
    color: #ffd700;
    font-size: 0.8rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    border: 1px solid rgba(255, 215, 0, 0.3);
    margin-top: 0.5rem;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .update-badge {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    margin-top: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    transition: all 0.2s ease;
    width: 100%;
    animation: fadeIn 0.5s ease-out;
  }

  .update-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  }

  .input-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #a3a3a3;
  }

  .username-input {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    color: #ffffff;
    outline: none;
    transition: all 0.2s ease;
  }

  .username-input::placeholder {
    color: #525252;
  }

  .username-input:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  }

  .play-button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    border-radius: 10px;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.05em;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  }

  .play-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  .play-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .play-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .footer-text {
    text-align: center;
    font-size: 0.75rem;
    color: #525252;
  }

  .progress-section {
    width: 100%;
    margin-top: -1rem;
    text-align: center;
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: #10b981;
    transition: width 0.3s ease;
  }

  .status-text {
    font-size: 0.75rem;
    color: #a3a3a3;
  }
</style>
