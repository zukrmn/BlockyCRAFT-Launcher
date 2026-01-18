<script lang="ts">
  import { Icons } from "../icons";
  import { i18n } from "../stores/i18n.svelte";
  import { ElectronService } from "../electron";

  let isOpen = $state(false);

  // Tabs state
  let activeTab = $state("general");
  let mods = $state<any[]>([]);
  let isLoadingMods = $state(false);

  // Load settings from localStorage
  let minMemory = $state(localStorage.getItem("settings.minMemory") || "512");
  let maxMemory = $state(localStorage.getItem("settings.maxMemory") || "2048");
  let javaArgs = $state(localStorage.getItem("settings.javaArgs") || "");

  function openModal() {
    isOpen = true;
    if (activeTab === "mods") {
        loadMods();
    }
  }

  function closeModal() {
    isOpen = false;
  }

  function saveSettings() {
    localStorage.setItem("settings.minMemory", minMemory);
    localStorage.setItem("settings.maxMemory", maxMemory);
    localStorage.setItem("settings.javaArgs", javaArgs);
    closeModal();
  }

  async function handleToggleMod(mod: any) {
    const newState = !mod.enabled;
    const result = await ElectronService.toggleMod(mod.fileName, newState);
    if (result.success) {
        loadMods();
    } else {
        alert(`Failed to toggle mod: ${result.error}`);
        loadMods(); // Reset UI state
    }
  }

  async function loadMods() {
    isLoadingMods = true;
    try {
        mods = await ElectronService.getMods();
    } catch (e) {
        console.error("Failed to load mods:", e);
    } finally {
        isLoadingMods = false;
    }
  }

  function switchTab(tab: string) {
    activeTab = tab;
    if (tab === "mods") {
        loadMods();
    }
  }

  // Calculate enabled count
  let enabledModsCount = $derived(mods.filter((m: any) => m.enabled).length);
  let totalModsCount = $derived(mods.length);

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeModal();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="settings-container">
  <button
    class="settings-toggle"
    onclick={openModal}
    title={i18n.t("ui.settings")}
  >
    <span class="icon">{@html Icons.Settings}</span>
  </button>

  {#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={handleBackdropClick}>
      <div class="modal">
        <div class="modal-header">
          <h2>{i18n.t("ui.settings")}</h2>
          <button class="close-btn" onclick={closeModal}>
            <span class="icon">{@html Icons.X}</span>
          </button>
        </div>

        <!-- Tabs -->
        <div class="tabs">
            <button 
                class="tab-btn" 
                class:active={activeTab === 'general'} 
                onclick={() => switchTab('general')}
            >
                {i18n.t("settings.tab.general")}
            </button>
            <button 
                class="tab-btn" 
                class:active={activeTab === 'mods'} 
                onclick={() => switchTab('mods')}
            >
                {i18n.t("settings.tab.mods")} 
                <span class="mod-count">{enabledModsCount}/{totalModsCount}</span>
            </button>
        </div>

        <div class="modal-content">
          {#if activeTab === 'general'}
              <!-- Memory Settings -->
              <div class="setting-group">
                <label for="minMemory">{i18n.t("settings.minMemory")}</label>
                <div class="input-with-suffix">
                  <input
                    type="number"
                    id="minMemory"
                    bind:value={minMemory}
                    min="256"
                    max="16384"
                    step="256"
                  />
                  <span class="suffix">MB</span>
                </div>
              </div>

              <div class="setting-group">
                <label for="maxMemory">{i18n.t("settings.maxMemory")}</label>
                <div class="input-with-suffix">
                  <input
                    type="number"
                    id="maxMemory"
                    bind:value={maxMemory}
                    min="512"
                    max="32768"
                    step="256"
                  />
                  <span class="suffix">MB</span>
                </div>
              </div>

              <!-- Java Arguments -->
              <div class="setting-group">
                <label for="javaArgs">{i18n.t("settings.javaArgs")}</label>
                <textarea
                  id="javaArgs"
                  bind:value={javaArgs}
                  placeholder="-Dorg.lwjgl.opengl.Display.allowSoftwareOpenGL=true"
                  rows="3"
                ></textarea>
                <span class="hint">{i18n.t("settings.javaArgsHint")}</span>
              </div>

          {:else if activeTab === 'mods'}
            <div class="mods-list">
                {#if isLoadingMods}
                    <div class="loading">{i18n.t("status.launching")}</div>
                {:else if mods.length === 0}
                    <div class="empty-state">
                        <span class="icon-large">{@html Icons.Box}</span>
                        <p>{i18n.t("settings.mods.empty")}</p>
                    </div>
                {:else}
                    {#each mods as mod}
                        <div class="mod-item" class:disabled={!mod.enabled}>
                            <div class="toggle-wrapper">
                                <input 
                                    type="checkbox" 
                                    checked={mod.enabled} 
                                    onchange={() => handleToggleMod(mod)}
                                    class="toggle-switch"
                                    title={mod.enabled ? "Disable" : "Enable"}
                                />
                            </div>
                            <div class="mod-info">
                                <div class="mod-header">
                                    <span class="mod-name">{mod.name || mod.fileName}</span>
                                    {#if mod.version}
                                        <span class="mod-version">v{mod.version}</span>
                                    {/if}
                                </div>
                                <p class="mod-description">
                                    {mod.description || i18n.t("settings.mods.empty").replace('mods', 'description')}
                                </p>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
          {/if}
        </div>

        <div class="modal-footer">
          {#if activeTab === 'general'}
            <button class="btn-cancel" onclick={closeModal}>
                {i18n.t("ui.cancel")}
            </button>
            <button class="btn-save" onclick={saveSettings}>
                {i18n.t("ui.save")}
            </button>
          {:else}
             <!-- Nothing for mods tab footer yet, maybe 'Open Folder' later -->
             <button class="btn-cancel" onclick={closeModal}>
                {i18n.t("ui.close")}
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .settings-container {
    position: relative;
    display: inline-block;
  }

  .settings-toggle {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .settings-toggle:hover {
    background: var(--color-border);
    transform: scale(1.05);
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 600px; /* Slightly wider for mods */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    max-height: 85vh; /* Limit height */
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--color-text-main);
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text-muted);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    color: var(--color-text-main);
    background: rgba(255, 255, 255, 0.1);
  }

  /* Icon styles for inline SVGs */
  :global(.icon) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.icon svg) {
    width: 20px;
    height: 20px;
  }

  :global(.icon-large) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #555;
  }

  :global(.icon-large svg) {
    width: 48px;
    height: 48px;
  }

  .settings-toggle :global(.icon) {
    color: white;
  }

  .close-btn :global(.icon) {
    color: inherit;
  }

  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--color-border);
    background: rgba(0,0,0,0.2);
    padding: 0 var(--spacing-md);
  }

  .tab-btn {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    padding: 12px 16px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab-btn:hover {
    color: var(--color-text-main);
    background: rgba(255,255,255,0.02);
  }

  .tab-btn.active {
    color: var(--color-text-main);
    border-bottom-color: white;
  }

  .mod-count {
    font-size: 0.8rem;
    background: rgba(255,255,255,0.1);
    padding: 2px 6px;
    border-radius: 10px;
  }

  .modal-content {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    overflow-y: auto; /* Scrollable content */
    flex: 1;
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .setting-group label {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .input-with-suffix {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .input-with-suffix input {
    flex: 1;
    background: var(--color-bg-input);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 10px 12px;
    color: var(--color-text-main);
    font-size: 0.95rem;
    font-family: inherit;
  }

  .input-with-suffix input:focus {
    outline: none;
    border-color: white;
  }

  .suffix {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    min-width: 30px;
  }

  textarea {
    background: var(--color-bg-input);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 10px 12px;
    color: var(--color-text-main);
    font-size: 0.9rem;
    font-family: "Consolas", "Monaco", monospace;
    resize: vertical;
    min-height: 60px;
  }

  textarea:focus {
    outline: none;
    border-color: white;
  }

  textarea::placeholder {
    color: #555;
    font-style: italic;
  }

  .hint {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    opacity: 0.7;
  }

  /* Mods List Styles */
  .mods-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mod-item {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  
  .mod-item.disabled {
    opacity: 0.5;
  }

  .toggle-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4px;
  }

  .toggle-switch {
    appearance: none;
    width: 36px;
    height: 20px;
    background: #444;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
    outline: none;
  }

  .toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: left 0.2s;
  }

  .toggle-switch:checked {
    /* Use white or a nice green/accent for checked state. User asked for white tab indicator, maybe white switch is too much? default logic says primary. */
    background: #4CAF50; /* Green for enabled looks good */
  }

  .toggle-switch:checked::after {
    left: 18px;
  }

  .mod-info {
    flex: 1;
  }

  .mod-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .mod-name {
    font-weight: 700;
    color: var(--color-text-main);
    font-size: 1rem;
  }

  .mod-version {
     font-size: 0.8rem;
     color: var(--color-text-muted);
     background: rgba(0,0,0,0.3);
     padding: 2px 6px;
     border-radius: 4px;
  }

  .mod-description {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin: 0;
    line-height: 1.4;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--color-text-muted);
    gap: 10px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .btn-cancel,
  .btn-save {
    padding: 8px 20px;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 0.9rem;
  }

  .btn-cancel {
    background: transparent;
    color: var(--color-text-muted);
    border: 1px solid var(--color-border);
  }

  .btn-cancel:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-main);
  }

  .btn-save {
    background: white;
    color: black;
  }

  .btn-save:hover {
    filter: brightness(0.9);
  }
</style>
