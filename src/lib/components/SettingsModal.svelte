<script lang="ts">
  import { Settings, X } from "lucide-svelte";
  import { i18n } from "../stores/i18n.svelte";

  let isOpen = $state(false);

  // Load settings from localStorage
  let minMemory = $state(localStorage.getItem("settings.minMemory") || "512");
  let maxMemory = $state(localStorage.getItem("settings.maxMemory") || "2048");
  let javaArgs = $state(localStorage.getItem("settings.javaArgs") || "");

  function openModal() {
    isOpen = true;
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
    <Settings size={20} color="white" />
  </button>

  {#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={handleBackdropClick}>
      <div class="modal">
        <div class="modal-header">
          <h2>{i18n.t("ui.settings")}</h2>
          <button class="close-btn" onclick={closeModal}>
            <X size={20} />
          </button>
        </div>

        <div class="modal-content">
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
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" onclick={closeModal}>
            {i18n.t("ui.cancel")}
          </button>
          <button class="btn-save" onclick={saveSettings}>
            {i18n.t("ui.save")}
          </button>
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
    max-width: 450px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
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

  .modal-content {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
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

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--color-border);
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
