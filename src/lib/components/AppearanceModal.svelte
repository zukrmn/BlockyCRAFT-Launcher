<script lang="ts">
  import { Icons } from "../icons";
  import { i18n } from "../stores/i18n.svelte";

  let isOpen = $state(false);
  let fileInputRef: HTMLInputElement;

  // Default values
  const DEFAULTS = {
    backgroundImage: "",
    backgroundFit: "cover",
    bgDim: 100, // brightness %
    bgBlur: 0, // px
    panelOpacity: 1, // 0-1
    panelBlur: 10, // px
    colorPrimary: "#333333",
    colorBackground: "#121212"
  };

  // Max image size in bytes (2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  // State - load from localStorage
  let backgroundImage = $state(localStorage.getItem("appearance.backgroundImage") || "");
  let backgroundFit = $state(localStorage.getItem("appearance.backgroundFit") || DEFAULTS.backgroundFit);
  let bgDim = $state(parseInt(localStorage.getItem("appearance.bgDim") || DEFAULTS.bgDim.toString()));
  let bgBlur = $state(parseInt(localStorage.getItem("appearance.bgBlur") || DEFAULTS.bgBlur.toString()));
  let panelOpacity = $state(parseFloat(localStorage.getItem("appearance.panelOpacity") || DEFAULTS.panelOpacity.toString()));
  let panelBlur = $state(parseInt(localStorage.getItem("appearance.panelBlur") || DEFAULTS.panelBlur.toString()));
  
  let colorPrimary = $state(localStorage.getItem("appearance.colorPrimary") || DEFAULTS.colorPrimary);
  let colorBackground = $state(localStorage.getItem("appearance.colorBackground") || DEFAULTS.colorBackground);
  
  let errorMessage = $state("");
  let isLoadingImage = $state(false);

  function openModal() {
    isOpen = true;
    errorMessage = "";
  }

  function closeModal() {
    isOpen = false;
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

  function triggerFileSelect() {
    fileInputRef?.click();
  }

  async function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    errorMessage = "";
    
    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      errorMessage = i18n.t("appearance.background_error_size");
      input.value = "";
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      errorMessage = i18n.t("appearance.background_error_invalid");
      input.value = "";
      return;
    }
    
    isLoadingImage = true;
    
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          backgroundImage = result;
          saveAndApply();
        }
        isLoadingImage = false;
      };
      
      reader.onerror = () => {
        errorMessage = i18n.t("appearance.background_error_invalid");
        isLoadingImage = false;
      };
      
      reader.readAsDataURL(file);
    } catch (e) {
      errorMessage = i18n.t("appearance.background_error_invalid");
      isLoadingImage = false;
    }
    
    // Reset input to allow selecting the same file again
    input.value = "";
  }

  function removeBackground() {
    backgroundImage = "";
    saveAndApply();
  }

  function setBackgroundFit(fit: string) {
    backgroundFit = fit;
    saveAndApply();
  }

  function handleColorPrimaryChange(e: Event) {
    colorPrimary = (e.target as HTMLInputElement).value;
    saveAndApply();
  }

  function handleColorBackgroundChange(e: Event) {
    colorBackground = (e.target as HTMLInputElement).value;
    saveAndApply();
  }

  // Handle sliders
  function handleSliderChange(e: Event, type: 'bgDim' | 'bgBlur' | 'panelOpacity' | 'panelBlur') {
    const value = parseFloat((e.target as HTMLInputElement).value);
    
    if (type === 'bgDim') bgDim = value;
    else if (type === 'bgBlur') bgBlur = value;
    else if (type === 'panelOpacity') panelOpacity = value;
    else if (type === 'panelBlur') panelBlur = value;
    
    saveAndApply();
  }

  function resetToDefaults() {
    // if (!confirm(i18n.t("appearance.reset_confirm"))) return; // Removed to fix focus bug
    
    backgroundImage = DEFAULTS.backgroundImage;
    backgroundFit = DEFAULTS.backgroundFit;
    bgDim = DEFAULTS.bgDim;
    bgBlur = DEFAULTS.bgBlur;
    panelOpacity = DEFAULTS.panelOpacity;
    panelBlur = DEFAULTS.panelBlur;
    colorPrimary = DEFAULTS.colorPrimary;
    colorBackground = DEFAULTS.colorBackground;
    
    saveAndApply();
  }

  function saveAndApply() {
    try {
      // Save to localStorage
      if (backgroundImage) {
        localStorage.setItem("appearance.backgroundImage", backgroundImage);
      } else {
        localStorage.removeItem("appearance.backgroundImage");
      }
      localStorage.setItem("appearance.backgroundFit", backgroundFit);
      localStorage.setItem("appearance.bgDim", bgDim.toString());
      localStorage.setItem("appearance.bgBlur", bgBlur.toString());
      localStorage.setItem("appearance.panelOpacity", panelOpacity.toString());
      localStorage.setItem("appearance.panelBlur", panelBlur.toString());
      localStorage.setItem("appearance.colorPrimary", colorPrimary);
      localStorage.setItem("appearance.colorBackground", colorBackground);
      
      // Apply to DOM
      applyAppearance();
    } catch (e) {
      console.error("Failed to save appearance settings:", e);
      errorMessage = "Failed to save settings (storage full?)";
    }
  }

  function applyAppearance() {
    const root = document.documentElement;
    
    // Background Image
    // Note: We use CSS variables now, handled by theme.css body::before
    if (backgroundImage) {
      root.style.setProperty("--bg-image", `url(${backgroundImage})`);
      root.style.setProperty("--bg-fit", backgroundFit);
    } else {
      root.style.removeProperty("--bg-image");
      root.style.removeProperty("--bg-fit");
    }

    // Advanced Controls
    root.style.setProperty("--bg-dim", `${bgDim}%`);
    root.style.setProperty("--bg-blur", `${bgBlur}px`);
    root.style.setProperty("--panel-opacity", panelOpacity.toString());
    root.style.setProperty("--panel-blur", `${panelBlur}px`);
    
    // Colors
    root.style.setProperty("--color-primary", colorPrimary);
    root.style.setProperty("--color-primary-hover", adjustBrightness(colorPrimary, -20));
    root.style.setProperty("--color-bg-dark", colorBackground);
  }

  // Helper to darken/lighten a hex color
  function adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Export for App.svelte to call on mount
  export function initAppearance() {
    applyAppearance();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="appearance-container">
  <button
    class="appearance-toggle"
    onclick={openModal}
    title={i18n.t("ui.appearance")}
  >
    <span class="icon">{@html Icons.Palette}</span>
  </button>

  {#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={handleBackdropClick}>
      <div class="modal">
        <div class="modal-header">
          <h2>{i18n.t("appearance.title")}</h2>
          <button class="close-btn" onclick={closeModal}>
            <span class="icon">{@html Icons.X}</span>
          </button>
        </div>

        <div class="modal-content smart-scroll">
          <!-- Background Image Section -->
          <div class="setting-section">
            <h3>{i18n.t("appearance.background")}</h3>
            
            <div class="background-controls">
              {#if backgroundImage}
                <div class="preview-container">
                  <img src={backgroundImage} alt="Background preview" class="background-preview" />
                  <button class="remove-btn" onclick={removeBackground} title={i18n.t("appearance.background_remove")}>
                    <span class="icon-small">{@html Icons.Trash}</span>
                  </button>
                </div>
              {:else}
                <div class="no-image" onclick={triggerFileSelect}>
                  <span class="icon-large">{@html Icons.Image}</span>
                  <span>{i18n.t("appearance.background_select")}</span>
                </div>
              {/if}
              
              <input
                type="file"
                accept="image/*"
                bind:this={fileInputRef}
                onchange={handleFileSelect}
                style="display: none;"
              />
              
              {#if backgroundImage}
                <button class="btn-secondary" onclick={triggerFileSelect}>
                  {i18n.t("appearance.background_select")}
                </button>
              {/if}
            </div>
            
            {#if errorMessage}
              <span class="error-msg">{errorMessage}</span>
            {/if}
            
            {#if isLoadingImage}
              <span class="loading-msg">Loading...</span>
            {/if}
          </div>

          <!-- Background Controls -->
          {#if backgroundImage}
            <div class="setting-section">
              <h3>{i18n.t("appearance.zoom")}</h3>
              <div class="fit-options">
                <button 
                  class="fit-option" 
                  class:selected={backgroundFit === "cover"}
                  onclick={() => setBackgroundFit("cover")}
                >
                  {i18n.t("appearance.zoom_cover")}
                </button>
                <button 
                  class="fit-option" 
                  class:selected={backgroundFit === "contain"}
                  onclick={() => setBackgroundFit("contain")}
                >
                  {i18n.t("appearance.zoom_contain")}
                </button>
              </div>

              <!-- Background Sliders -->
               <div class="slider-group">
                 <div class="slider-row">
                    <label>{i18n.t("appearance.bg_dim")}</label>
                    <input type="range" min="0" max="100" value={bgDim} oninput={(e) => handleSliderChange(e, 'bgDim')} />
                    <span class="slider-value">{bgDim}%</span>
                 </div>
                 <div class="slider-row">
                    <label>{i18n.t("appearance.bg_blur")}</label>
                    <input type="range" min="0" max="10" step="0.5" value={bgBlur} oninput={(e) => handleSliderChange(e, 'bgBlur')} />
                    <span class="slider-value">{bgBlur}px</span>
                 </div>
               </div>
            </div>
          {/if}

          <!-- Panel Controls -->
           <div class="setting-section">
              <h3>{i18n.t("appearance.panels")}</h3>
               <div class="slider-group">
                 <div class="slider-row">
                    <label>{i18n.t("appearance.panel_opacity")}</label>
                    <input type="range" min="0" max="1" step="0.05" value={panelOpacity} oninput={(e) => handleSliderChange(e, 'panelOpacity')} />
                    <span class="slider-value">{Math.round(panelOpacity * 100)}%</span>
                 </div>
                 <div class="slider-row">
                    <label>{i18n.t("appearance.panel_blur")}</label>
                    <input type="range" min="0" max="20" step="1" value={panelBlur} oninput={(e) => handleSliderChange(e, 'panelBlur')} />
                    <span class="slider-value">{panelBlur}px</span>
                 </div>
               </div>
           </div>

          <!-- Colors Section -->
          <div class="setting-section">
            <h3>{i18n.t("appearance.colors")}</h3>
            
            <div class="color-grid">
              <div class="color-item">
                <label>{i18n.t("appearance.color_primary")}</label>
                <div class="color-input-wrapper">
                  <input 
                    type="color" 
                    value={colorPrimary} 
                    onchange={handleColorPrimaryChange}
                    class="color-picker"
                  />
                  <span class="color-value">{colorPrimary}</span>
                </div>
              </div>
              
              <div class="color-item">
                <label>{i18n.t("appearance.color_background")}</label>
                <div class="color-input-wrapper">
                  <input 
                    type="color" 
                    value={colorBackground} 
                    onchange={handleColorBackgroundChange}
                    class="color-picker"
                  />
                  <span class="color-value">{colorBackground}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-reset" onclick={resetToDefaults}>
            <span class="icon-small">{@html Icons.RotateCcw}</span>
            {i18n.t("appearance.reset")}
          </button>
          <button class="btn-close" onclick={closeModal}>
            {i18n.t("ui.close")}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .appearance-container {
    position: relative;
    display: inline-block;
  }

  .appearance-toggle {
    background: var(--color-bg-card);
    border: 1px solid var(--color-primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .appearance-toggle:hover {
    background: var(--color-border);
    transform: scale(1.05);
  }

  .appearance-toggle :global(.icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .appearance-toggle :global(.icon svg) {
    width: 20px;
    height: 20px;
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
    max-width: 500px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    max-height: 85vh;
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

  .modal-content {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
  }

  .setting-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .setting-section h3 {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .background-controls {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .preview-container {
    position: relative;
    width: 100%;
    height: 120px;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border);
  }

  .background-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ef4444;
    transition: all 0.2s;
  }

  .remove-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: scale(1.1);
  }

  .no-image {
    width: 100%;
    height: 120px;
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s;
  }

  .no-image:hover {
    border-color: var(--color-text-muted);
    background: rgba(255, 255, 255, 0.02);
  }

  :global(.icon-large) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
  }

  :global(.icon-large svg) {
    width: 40px;
    height: 40px;
  }

  :global(.icon-small) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.icon-small svg) {
    width: 16px;
    height: 16px;
  }

  .btn-secondary {
    background: var(--color-bg-input);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 8px 16px;
    color: var(--color-text-main);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--color-border-hover);
  }

  .hint {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    opacity: 0.7;
  }

  .error-msg {
    font-size: 0.8rem;
    color: #ef4444;
  }

  .loading-msg {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-style: italic;
  }

  .fit-options {
    display: flex;
    gap: 8px;
  }

  .fit-option {
    flex: 1;
    background: var(--color-bg-input);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 10px 16px;
    color: var(--color-text-main);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fit-option:hover {
    border-color: var(--color-border-hover);
    background: rgba(255, 255, 255, 0.05);
  }

  .fit-option.selected {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .slider-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--color-bg-input);
    padding: 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .slider-row {
     display: flex;
     align-items: center;
     gap: 12px;
  }

  .slider-row label {
      font-size: 0.85rem;
      width: 120px;
      color: var(--color-text-muted);
  }

  .slider-row input[type="range"] {
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: #4a4a4a;
      outline: none;
      -webkit-appearance: none;
  }

  .slider-row input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
  }

  .slider-value {
      width: 40px;
      text-align: right;
      font-size: 0.85rem;
      font-family: monospace;
      color: var(--color-text-main);
  }

  .color-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .color-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .color-item label {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .color-input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--color-bg-input);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 6px 10px;
  }

  .color-picker {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    background: none;
  }

  .color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .color-picker::-webkit-color-swatch {
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .color-value {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    font-family: "Consolas", "Monaco", monospace;
    text-transform: uppercase;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .btn-reset {
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 8px 16px;
    color: var(--color-text-muted);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-reset:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-main);
  }

  .btn-close {
    background: white;
    color: black;
    border: none;
    border-radius: var(--radius-md);
    padding: 8px 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-close:hover {
    filter: brightness(0.9);
  }

  /* Icon within buttons inherit proper colors */
  .close-btn :global(.icon),
  .btn-reset :global(.icon-small) {
    color: inherit;
  }
</style>
