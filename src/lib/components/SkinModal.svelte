<script lang="ts">
  import { Icons } from "../icons";
  import { i18n } from "../stores/i18n.svelte";
  import TextInput from "./TextInput.svelte";

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
  let previewUrl = $state("");
  let isSaving = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");

  // Max image size in bytes (2MB)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  function openModal() {
    isOpen = true;
    errorMessage = "";
    successMessage = "";
    password = "";
    skinUrl = "";
    selectedFile = null;
    previewUrl = "";
    
    // Reset file input so selecting the same file again triggers onchange
    if (fileInputRef) fileInputRef.value = "";
  }

  function closeModal() {
    if (isSaving) return;
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

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    errorMessage = "";
    successMessage = "";

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      errorMessage = i18n.t("appearance.background_error_size");
      input.value = "";
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/png")) {
      errorMessage = i18n.t("appearance.background_error_invalid") + " (PNG only)";
      input.value = "";
      return;
    }

    selectedFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      previewUrl = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Clear manual URL if file is selected
    skinUrl = "";
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

  async function handleSave() {
    if (!password) {
      errorMessage = i18n.t("skin.password_placeholder");
      return;
    }

    if (!selectedFile && !skinUrl) {
      errorMessage = i18n.t("skin.select_image");
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

      // 1. Convert to Base64 if a file is selected
      if (selectedFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]); // Remove data:image/png;base64,
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile!);
        });
        finalPayload.imageData = await base64Promise;
      } else {
        finalPayload.skinUrl = skinUrl;
      }

      // 2. Dispatch to Backend via Main Process (Bypass CORS)
      const result = await (window as any).electronAPI.invoke("fetch-url", {
        url: "https://talk.craft.blocky.com.br/api/v1/update-skin",
        method: "POST",
        body: JSON.stringify(finalPayload),
      }) as { success: boolean, status: number, data: string, error?: string };

      if (result.success) {
        successMessage = i18n.t("skin.save_success");
        // Clear sensitive info
        password = "";
        selectedFile = null;
        // Keep the success message visible for a moment then close
        setTimeout(() => {
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
              {#if previewUrl || skinUrl}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="preview-container clickable" onclick={triggerFileSelect} title={i18n.t("appearance.background_select")}>
                  <img
                    src={previewUrl || skinUrl}
                    alt="Skin preview"
                    class="skin-preview"
                  />
                </div>
              {:else}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="no-image" onclick={triggerFileSelect}>
                  <span class="icon-large">{@html Icons.Image}</span>
                  <span>{i18n.t("skin.select_image")}</span>
                </div>
              {/if}

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
              onkeypress={() => { selectedFile = null; previewUrl = ""; }}
            />
          </div>

          <div class="setting-section">
            <h3>{i18n.t("skin.password_label")}</h3>
            <TextInput 
              type="password" 
              bind:value={password} 
              placeholder={i18n.t("skin.password_placeholder")} 
            />
          </div>

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

        <div class="modal-footer">
          <button class="btn-cancel" onclick={closeModal} disabled={isSaving}>
            {i18n.t("ui.cancel")}
          </button>
          <button class="btn-save" onclick={handleSave} disabled={isSaving}>
            {#if isSaving}
              ...
            {:else}
              {i18n.t("ui.save")}
            {/if}
          </button>
        </div>
      </div>
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
    width: 90%;
    max-width: 400px;
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
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: center;
  }

  .preview-container {
    width: 128px;
    height: 128px;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .preview-container.clickable {
    cursor: pointer;
  }

  .preview-container.clickable:hover {
    border-color: var(--color-text-muted);
    background: rgba(255, 255, 255, 0.05);
  }

  .skin-preview {
    max-width: 100%;
    max-height: 100%;
    image-rendering: pixelated;
  }

  .no-image {
    width: 128px;
    height: 128px;
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
    text-align: center;
    padding: 10px;
  }

  .no-image:hover {
    border-color: var(--color-text-muted);
    background: rgba(255, 255, 255, 0.02);
  }


  .message {
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    text-align: center;
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
    filter: brightness(0.9);
    transform: none;
  }

  .btn-save:disabled,
  .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

</style>
