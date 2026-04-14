<script lang="ts">
  import { onMount } from "svelte";
  import { Icons } from "../icons";
  import { i18n } from "../stores/i18n.svelte";
  import TextInput from "./TextInput.svelte";
  import { SkinViewer } from "skinview3d";

  // Props
  interface Props {
    username?: string;
  }
  let { username = "" }: Props = $props();

  let isOpen = $state(false);
  let fileInputRef = $state<HTMLInputElement>();
  let skinUrl = $state("");
  let password = $state("");
  let selectedFile = $state<File | null>(null);
  let isSaving = $state(false);
  
  // Slot System State
  let fileTarget = $state<'main' | number>('main');
  let visualizerSkin = $state({ base64: "", url: "" });
  
  let errorMessage = $state("");
  let successMessage = $state("");

  // 3D Viewer State
  let canvasRef = $state<HTMLCanvasElement>();
  let skinViewer: SkinViewer | undefined;

  interface SavedSkin {
    id: string;
    url?: string;
    base64?: string;
    timestamp: number;
    isEmpty?: boolean;
  }
  
  let extraSlots = $state<SavedSkin[]>([]);
  const MAX_EXTRA_SLOTS = 5;

  onMount(() => {
    loadSavedSkins();
    loadCurrentSelection();
  });

  function loadSavedSkins() {
    if (!username) return;
    const stored = localStorage.getItem(`extra_skins_${username}`);
    if (stored) {
      try {
        extraSlots = JSON.parse(stored);
      } catch (e) {
        console.error("Error loading extra skins", e);
        extraSlots = createEmptySlots();
      }
    } else {
      extraSlots = createEmptySlots();
    }
    
    // Ensure we always have exactly 5 slots
    if (extraSlots.length !== MAX_EXTRA_SLOTS) {
      extraSlots = createEmptySlots();
    }
  }

  function createEmptySlots(): SavedSkin[] {
    return new Array(MAX_EXTRA_SLOTS).fill(null).map((_, i) => ({
      id: `slot-${i}`,
      timestamp: 0,
      isEmpty: true
    }));
  }

  function saveSkinsToStorage() {
    if (!username) return;
    localStorage.setItem(`extra_skins_${username}`, JSON.stringify(extraSlots));
  }

  function loadCurrentSelection() {
    if (!username) return;
    const stored = localStorage.getItem(`current_skin_${username}`);
    if (stored) {
      try {
        visualizerSkin = JSON.parse(stored);
      } catch (e) {
        console.error("Error loading current selection", e);
      }
    }
  }

  function saveCurrentSelection() {
    if (!username) return;
    localStorage.setItem(`current_skin_${username}`, JSON.stringify(visualizerSkin));
  }

  function initSkinViewer() {
    if (!canvasRef) return;
    
    if (skinViewer) {
      skinViewer.dispose();
    }

    skinViewer = new SkinViewer({
      canvas: canvasRef,
      width: 200,
      height: 260,
      skin: visualizerSkin.base64 || visualizerSkin.url || "https://mineskin.org/skins/steve"
    });

    // Configure viewer
    skinViewer.autoRotate = true;
    skinViewer.autoRotateSpeed = 0.5;
    skinViewer.camera.position.set(-15, 10, 45);
    skinViewer.controls.enableZoom = false;
  }

  $effect(() => {
    if (isOpen && canvasRef && !skinViewer) {
      initSkinViewer();
    }
    
    // Cleanup when closing
    if (!isOpen && skinViewer) {
      skinViewer.dispose();
      skinViewer = undefined;
    }
  });

  // Update skin viewer and save selection when visualizerSkin changes
  $effect(() => {
    if (skinViewer) {
      const targetSkin = visualizerSkin.base64 || visualizerSkin.url || "https://mineskin.org/skins/steve";
      skinViewer.loadSkin(targetSkin);
    }
    
    if (visualizerSkin.base64 || visualizerSkin.url) {
      saveCurrentSelection();
    }
  });

  // Sync skinUrl input to visualizerSkin
  $effect(() => {
    if (skinUrl) {
      visualizerSkin = { base64: "", url: skinUrl };
      selectedFile = null;
    }
  });

  function addCurrentToExtraSlot() {
    if (!visualizerSkin.base64 && !visualizerSkin.url) return;

    const emptyIndex = extraSlots.findIndex(s => s.isEmpty);
    if (emptyIndex === -1) {
      errorMessage = i18n.t("skin.slot_limit");
      return;
    }

    extraSlots[emptyIndex] = {
      id: `slot-${emptyIndex}`,
      base64: visualizerSkin.base64,
      url: visualizerSkin.url,
      timestamp: Date.now(),
      isEmpty: false
    };

    saveSkinsToStorage();
    successMessage = i18n.t("skin.slot_saved");
    setTimeout(() => { successMessage = ""; }, 3000);
  }


  // Max image size in bytes (2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  let isPasswordPromptOpen = $state(false);

  function openModal() {
    isOpen = true;
    errorMessage = "";
    successMessage = "";
    password = "";
    isPasswordPromptOpen = false;
    
    loadSavedSkins();
    loadCurrentSelection();
    
    if (fileInputRef) fileInputRef.value = "";
  }

  function closeModal() {
    if (isSaving || isPasswordPromptOpen) return;
    isOpen = false;
  }

  function closePasswordPrompt() {
    if (isSaving) return;
    isPasswordPromptOpen = false;
    password = "";
    errorMessage = "";
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if (isPasswordPromptOpen) {
        closePasswordPrompt();
      } else {
        closeModal();
      }
    }
    
    if (e.key === "Enter" && isPasswordPromptOpen && !isSaving) {
      performSave();
    }
  }

  function triggerFileSelect(target: 'main' | number) {
    fileTarget = target;
    fileInputRef?.click();
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    errorMessage = "";
    successMessage = "";

    if (file.size > MAX_IMAGE_SIZE) {
      errorMessage = i18n.t("appearance.background_error_size");
      input.value = "";
      return;
    }

    if (!file.type.startsWith("image/png")) {
      errorMessage = i18n.t("appearance.background_error_invalid") + " (PNG only)";
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      
      if (fileTarget === 'main') {
        visualizerSkin = { base64: b64, url: "" };
        selectedFile = file; // For VPS upload
      } else if (typeof fileTarget === 'number') {
        extraSlots[fileTarget] = {
          id: `slot-${fileTarget}`,
          base64: b64,
          timestamp: Date.now(),
          isEmpty: false
        };
        saveSkinsToStorage();
        successMessage = i18n.t("skin.slot_saved");
        setTimeout(() => { successMessage = ""; }, 3000);
      }
    };
    reader.readAsDataURL(file);
    skinUrl = ""; // Clear manual URL
  }


  function selectFromSlot(index: number) {
    const slot = extraSlots[index];
    
    if (slot.isEmpty) {
      triggerFileSelect(index);
      return;
    }

    // Copy to visualizer
    visualizerSkin = {
      base64: slot.base64 || "",
      url: slot.url || ""
    };
    
    selectedFile = null;
  }

  function removeFromSlot(index: number, e: MouseEvent) {
    e.stopPropagation();
    extraSlots[index] = {
      id: `slot-${index}`,
      timestamp: 0,
      isEmpty: true
    };
    saveSkinsToStorage();
  }

  function formatRemaining(seconds: number): string {
    if (seconds >= 60) {
      const minutes = Math.ceil(seconds / 60);
      const unit = minutes === 1 ? i18n.t("time.minute") : i18n.t("time.minutes");
      return `${minutes} ${unit}`;
    }
    const unit = seconds === 1 ? i18n.t("time.second") : i18n.t("time.seconds");
    return `${seconds} ${unit}`;
  }

  function handleSave() {
    if (!visualizerSkin.base64 && !visualizerSkin.url && !selectedFile) {
      errorMessage = i18n.t("skin.select_image");
      return;
    }
    
    errorMessage = "";
    successMessage = "";
    isPasswordPromptOpen = true;
  }

  async function performSave() {
    if (!password) {
      errorMessage = i18n.t("skin.password_placeholder");
      return;
    }

    isSaving = true;
    errorMessage = "";
    successMessage = "";

    try {
      let finalPayload: any = {
        username,
        password,
      };

      // 1. Convert to Base64
      if (visualizerSkin.base64) {
        finalPayload.imageData = visualizerSkin.base64.split(",")[1];
      } else if (visualizerSkin.url) {
        finalPayload.skinUrl = visualizerSkin.url;
      } else if (selectedFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile!);
        });
        finalPayload.imageData = await base64Promise;
      }

      // 2. Dispatch to Backend via Main Process
      const result = await (window as any).electronAPI.invoke("fetch-url", {
        url: "https://talk.craft.blocky.com.br/api/v1/update-skin",
        method: "POST",
        body: JSON.stringify(finalPayload),
      }) as { success: boolean, status: number, data: string, error?: string };

      if (result.success) {
        successMessage = i18n.t("skin.save_success");
        password = "";
        selectedFile = null;
        
        setTimeout(() => {
          isPasswordPromptOpen = false;
          if (isOpen) closeModal();
        }, 2000);
      } else {
        let errorMsg = i18n.t("skin.save_error");
        try {
            const errorData = JSON.parse(result.data);
            if (errorData.error) {
                switch (errorData.error) {
                    case "invalid_credentials":
                        errorMsg = i18n.t("skin.invalid_password");
                        break;
                    case "too_many_attempts":
                        errorMsg = i18n.t("skin.too_many_attempts").replace("{time}", formatRemaining(errorData.remaining || 0));
                        break;
                    case "cooldown":
                        errorMsg = i18n.t("skin.cooldown").replace("{time}", formatRemaining(errorData.remaining || 0));
                        break;
                    default:
                        errorMsg = errorData.error;
                }
            }
        } catch(e) {
            if (result.error) errorMsg = result.error;
        }
        
        errorMessage = errorMsg;
      }
    } catch (e: any) {
      errorMessage = i18n.t("skin.save_error") + ": " + (e.message || "Unknown error");
      console.error("Fetch error:", e);
    } finally {
      isSaving = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="skin-container">
  <button
    class="skin-toggle"
    onclick={openModal}
    title={i18n.t("skin.title")}
  >
    <span class="icon">{@html Icons.User}</span>
  </button>

  {#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={handleBackdropClick}>
      <div class="modal">
        <div class="modal-header">
          <h2>{i18n.t("skin.title")}</h2>
          <button class="close-btn" onclick={closeModal} disabled={isSaving}>
            <span class="icon">{@html Icons.X}</span>
          </button>
        </div>

        <div class="modal-content smart-scroll">
          <div class="setting-section">
            <div class="skin-uploader">
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div class="viewer-container" onclick={() => triggerFileSelect('main')} title={i18n.t("appearance.background_select")}>
                <canvas bind:this={canvasRef} class="skin-canvas"></canvas>
                <div class="viewer-overlay">
                  <span class="icon-small">{@html Icons.Image}</span>
                  <span>{i18n.t("ui.change")}</span>
                </div>
              </div>

              <div class="slot-galery">
                {#each extraSlots as slot, i (slot.id)}
                   <!-- svelte-ignore a11y_click_events_have_key_events -->
                   <!-- svelte-ignore a11y_no_static_element_interactions -->
                   <div 
                    class="skin-slot" 
                    class:empty={slot.isEmpty}
                    onclick={() => selectFromSlot(i)}
                    class:active={!slot.isEmpty && ((slot.base64 && visualizerSkin.base64 === slot.base64) || (slot.url && visualizerSkin.url === slot.url))}
                   >
                     {#if !slot.isEmpty}
                        <img src={slot.base64 || slot.url} alt="Skin slot" />
                        <button class="remove-slot" onclick={(e) => removeFromSlot(i, e)}>
                           {@html Icons.X}
                        </button>
                     {:else}
                        <div class="slot-placeholder">
                           {@html Icons.User}
                        </div>
                     {/if}
                   </div>
                {/each}
                {#if extraSlots.some(s => s.isEmpty) && (visualizerSkin.base64 || visualizerSkin.url)}
                  <button class="add-slot-btn" onclick={addCurrentToExtraSlot} title="Salvar no primeiro slot vazio">
                    {@html Icons.Plus}
                    <span>{i18n.t("skin.slot_save_current") || "Salvar Atual"}</span>
                  </button>
                {/if}
              </div>

              <input
                type="file"
                accept="image/png"
                bind:this={fileInputRef}
                onchange={handleFileSelect}
                style="display: none;"
              />
            </div>
          </div>

          <div class="setting-section">
            <h3>{i18n.t("skin.url_placeholder")}</h3>
            <TextInput 
              bind:value={skinUrl} 
              placeholder="https://skin.png" 
              oninput={() => { selectedFile = null; }}
            />
          </div>

        </div>

        <div class="modal-footer">
          <button class="btn-cancel" onclick={closeModal} disabled={isSaving}>
            {i18n.t("ui.cancel")}
          </button>
          <button class="btn-save" onclick={handleSave} disabled={isSaving}>
            {i18n.t("ui.save")}
          </button>
        </div>
      </div>

      {#if isPasswordPromptOpen}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="password-prompt-overlay" onclick={closePasswordPrompt}>
          <div class="password-prompt-card" onclick={e => e.stopPropagation()}>
            <div class="prompt-header">
              <h3>{i18n.t("skin.password_label")}</h3>
              <button class="small-close-btn" onclick={closePasswordPrompt} disabled={isSaving}>
                <span class="icon-small">{@html Icons.X}</span>
              </button>
            </div>
            
            <div class="prompt-content">
              <TextInput 
                type="password" 
                bind:value={password} 
                placeholder={i18n.t("skin.password_placeholder")} 
                autofocus
              />

              {#if errorMessage}
                <div class="message error">{errorMessage}</div>
              {/if}

              {#if successMessage}
                <div class="message success">{successMessage}</div>
              {/if}
              
              {#if isSaving}
                <div class="message loading">
                   {selectedFile ? i18n.t("skin.uploading") : "..."}
                </div>
              {/if}
            </div>

            <div class="prompt-footer">
              <button class="btn-prompt-cancel" onclick={closePasswordPrompt} disabled={isSaving}>
                {i18n.t("ui.cancel")}
              </button>
              <button class="btn-prompt-confirm" onclick={performSave} disabled={isSaving}>
                {#if isSaving}
                  <span class="spinner-small"></span>
                  ...
                {:else}
                  {i18n.t("ui.confirm")}
                {/if}
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .skin-container {
    position: relative;
    display: inline-block;
  }

  .skin-toggle {
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

  .skin-toggle:hover {
    background: var(--color-border);
    transform: scale(1.05);
  }

  .skin-toggle :global(.icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .skin-toggle :global(.icon svg) {
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
    width: 95%;
    max-width: 550px;
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

  .close-btn:hover:not(:disabled) {
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
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .skin-uploader {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-lg);
    align-items: flex-start;
    justify-content: center;
    width: 100%;
  }

  .viewer-container {
    width: 200px;
    height: 260px;
    flex-shrink: 0;
    border-radius: var(--radius-lg);
    overflow: hidden;
    position: relative;
    background: radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.4);
  }

  .viewer-container:hover {
    border-color: var(--color-primary);
    background: radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 80%);
  }

  .viewer-container:hover .viewer-overlay {
    opacity: 1;
    transform: translateY(0);
  }

  .skin-canvas {
    width: 100% !important;
    height: 100% !important;
    outline: none;
    image-rendering: pixelated;
  }

  .viewer-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    color: white;
    font-size: 0.8rem;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .slot-galery {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    justify-content: flex-start;
    padding: var(--spacing-xs) 0;
    flex: 1;
  }

  .skin-slot {
    width: 100%;
    height: 40px;
    border-radius: var(--radius-md);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
  }

  .skin-slot img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
    border-radius: calc(var(--radius-md) - 2px);
  }

  .skin-slot.empty {
    border-style: dashed;
    background: rgba(255, 255, 255, 0.02);
  }

  .slot-placeholder {
    opacity: 0.2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slot-placeholder :global(svg) {
    width: 24px;
    height: 24px;
  }

  .skin-slot:hover {
    border-color: var(--color-primary);
    transform: translateX(4px);
    background: rgba(255, 255, 255, 0.05);
  }

  .skin-slot.active {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.3);
    background: rgba(var(--color-primary-rgb), 0.05);
  }

  .remove-slot {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 24px;
    background: rgba(239, 68, 68, 0.1);
    border: none;
    border-left: 1px solid rgba(239, 68, 68, 0.2);
    color: #f87171;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.2s;
  }

  .remove-slot:hover {
    background: #ef4444;
    color: white;
  }

  .remove-slot :global(svg) {
    width: 12px;
    height: 12px;
  }

  .skin-slot:hover .remove-slot {
    opacity: 1;
  }

  .add-slot-btn {
    width: 100%;
    height: 32px;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: auto;
    box-shadow: 0 2px 10px rgba(var(--color-primary-rgb), 0.3);
  }

  .add-slot-btn:hover {
    filter: brightness(0.9);
    transform: translateY(-1px);
  }

  .add-slot-btn :global(svg) {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  .message {
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    text-align: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .message.error {
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .message.success {
    background: rgba(34, 197, 94, 0.1);
    color: #4ade80;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  .message.loading {
    color: var(--color-text-muted);
  }

  .modal-footer {
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    border-top: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .btn-save,
  .btn-cancel {
    padding: 8px 20px;
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 0.9rem;
    min-width: 100px;
  }

  .btn-cancel {
    background: transparent;
    color: var(--color-text-muted);
    border: 1px solid var(--color-border);
  }

  .btn-cancel:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-main);
  }

  .btn-save {
    background: white;
    color: black;
  }

  .btn-save:hover:not(:disabled) {
    background: #e2e8f0;
    transform: translateY(-1px);
  }

  .btn-save:disabled,
  .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Password Prompt Styles */
  .password-prompt-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    border-radius: var(--radius-lg);
    animation: fadeInOverlay 0.2s ease-out;
  }

  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .password-prompt-card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-lg);
    width: 320px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: promptSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes promptSlideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .prompt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    background: rgba(var(--color-primary-rgb), 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .prompt-header h3 {
    margin: 0;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .small-close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text-muted);
    padding: 4px;
    display: flex;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .small-close-btn:hover:not(:disabled) {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  .prompt-content {
    padding: var(--spacing-lg) var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .prompt-footer {
    padding: var(--spacing-md);
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
    background: rgba(0, 0, 0, 0.2);
  }

  .btn-prompt-cancel {
    padding: 8px 16px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
  }

  .btn-prompt-cancel:hover:not(:disabled) {
    color: var(--color-text-main);
    background: rgba(255, 255, 255, 0.05);
  }

  .btn-prompt-confirm {
    padding: 8px 24px;
    border-radius: var(--radius-md);
    border: none;
    background: white;
    color: black;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .btn-prompt-confirm:hover:not(:disabled) {
    background: #e2e8f0;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .btn-prompt-confirm:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner-small {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

</style>
