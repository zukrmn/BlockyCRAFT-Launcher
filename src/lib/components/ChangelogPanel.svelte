<script lang="ts">
  import { i18n } from "../stores/i18n.svelte";
  import { marked } from "marked";
  import { ElectronService } from "../electron";

  let changelogContent = $state("");
  let isLoading = $state(false);

  const updateUrls = {
      pt: "https://craft.blocky.com.br/launcher-assets/pt-updates.md",
      en: "https://craft.blocky.com.br/launcher-assets/en-updates.md",
      es: "https://craft.blocky.com.br/launcher-assets/es-updates.md"
  };

  async function fetchUpdates(langCode: string) {
      if (!langCode) {
          console.warn("[ChangelogPanel] No language code provided");
          return;
      }

      // Extract base language (pt-BR -> pt)
      const baseLang = langCode.split('-')[0].toLowerCase();
      // Fallback to PT if unknown key
      const url = (updateUrls as any)[baseLang] || updateUrls['pt']; 
      
      const fullUrl = url + '?t=' + Date.now();

      isLoading = true;
      try {
          const res = await ElectronService.fetchUrl(fullUrl);
          
          if (!res.success || !res.data) {
              throw new Error(res.error || "Fetch failed");
          }
          
          changelogContent = await marked.parse(res.data);
      } catch (e) {
          console.error("Failed to fetch changelog:", e);
          changelogContent = `<p style="color: #ef4444;">Failed to load updates. Please check your internet connection.</p>`;
      } finally {
          isLoading = false;
      }
  }

  // Reactive fetching
  $effect(() => {
     fetchUpdates(i18n.lang);
  });
</script>

<div class="changelog-panel">
  <h2>{i18n.t("ui.changelog")}</h2>
  <div class="content smart-scroll">
      {#if isLoading}
        <div class="loading">Loading updates...</div>
      {:else}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div class="markdown-body">
            {@html changelogContent}
        </div>
      {/if}
  </div>
</div>

<style>
  .changelog-panel {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  
  h2 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-text-muted);
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    overflow-y: auto; /* Scrollable content area */
    padding-right: 8px; /* Room for scrollbar */
  }

  .loading {
    color: var(--color-text-muted);
    font-style: italic;
    padding: 20px 0;
  }

  /* Global styles for generic markdown elements rendered via @html */
  :global(.markdown-body) {
    color: #e2e8f0;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  :global(.markdown-body h1),
  :global(.markdown-body h2) {
    font-size: 1.3rem;
    color: white;
    margin: 1.5rem 0 0.75rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.3rem;
  }

  :global(.markdown-body h1:first-child),
  :global(.markdown-body h2:first-child) {
    margin-top: 0;
  }

  :global(.markdown-body h3) {
    font-size: 1.1rem;
    color: #f1f5f9;
    margin: 1.25rem 0 0.5rem 0;
    font-weight: 600;
  }

  :global(.markdown-body h4) {
    font-size: 1rem;
    color: #cbd5e1;
    margin: 1rem 0 0.5rem 0;
  }

  :global(.markdown-body p) {
    margin-bottom: 0.75rem;
    color: #e2e8f0;
  }

  :global(.markdown-body ul), 
  :global(.markdown-body ol) {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    color: #cbd5e1;
  }
  
  :global(.markdown-body li) {
    margin-bottom: 0.25rem;
  }

  :global(.markdown-body a) {
    color: var(--color-primary);
    text-decoration: none;
  }

  :global(.markdown-body a:hover) {
    text-decoration: underline;
  }
  
  :global(.markdown-body strong) {
    color: white;
    font-weight: 700;
  }
  
  :global(.markdown-body code) {
    background: rgba(0,0,0,0.3);
    padding: 2px 5px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }
  
  :global(.markdown-body hr) {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.1);
    margin: 1.5rem 0;
  }
</style>
