<script lang="ts">
  let username = $state('');
  
  function handlePlay() {
    if (!username.trim()) {
      alert('Por favor, insira um nome de usuário!');
      return;
    }
    console.log('Launching game for:', username);
    // Future: window.electronAPI.send('launch-game', { username });
  }
</script>

<main class="launcher">
  <div class="launcher-card">
    <div class="logo-section">
      <h1 class="logo-text">
        <span class="logo-blocky">Blocky</span><span class="logo-craft">CRAFT</span>
      </h1>
      <p class="version-text">Minecraft Beta 1.7.3</p>
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
      disabled={!username.trim()}
    >
      JOGAR
    </button>

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
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
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
</style>
