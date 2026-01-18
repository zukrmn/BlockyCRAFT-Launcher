<script lang="ts">
  import { ElectronService } from "../electron";
  import { i18n } from "../stores/i18n.svelte";

  let isOpened = $state(false);
  let timeoutId: NodeJS.Timeout;

  async function openTutorial() {
    if (isOpened) return; // Prevent double click spam

    const url = "https://docs.craft.blocky.com.br/";
    await ElectronService.openExternal(url);
    
    isOpened = true;
    
    // Clear previous timeout if exists
    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
        isOpened = false;
    }, 3000);
  }
</script>

<button class="tutorial-btn" class:opened={isOpened} onclick={openTutorial}>
  <div class="icon-wrapper">
    {#if isOpened}
      <!-- Check Icon (Green/Success) -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="icon-check"
      >
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    {:else}
      <!-- Lucide Book Open Icon -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    {/if}
  </div>
  
  <div class="text-content">
    {#if isOpened}
        <span class="title success-text">{i18n.t("ui.tutorial_opened")}</span>
    {:else}
        <span class="title">{i18n.t("ui.tutorial_title")}</span>
        <span class="subtitle">{i18n.t("ui.tutorial_subtitle")}</span>
    {/if}
  </div>
</button>

<style>
  .tutorial-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    background: transparent;
    border: 1px solid transparent;
    padding: var(--spacing-md);
    width: 100%;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: var(--radius-lg);
    color: var(--color-text-main);
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }

  .tutorial-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(1.02);
  }

  /* Success State */
  .tutorial-btn.opened {
    background: rgba(34, 197, 94, 0.1); 
    border-color: rgba(34, 197, 94, 0.3);
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    min-width: 24px; /* Fix layout shift */
  }

  .tutorial-btn.opened .icon-wrapper {
    color: #4ade80; /* Green icon */
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .title {
    font-size: 1rem;
    font-weight: 600;
    color: white;
  }

  .title.success-text {
      color: #4ade80;
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }
</style>
