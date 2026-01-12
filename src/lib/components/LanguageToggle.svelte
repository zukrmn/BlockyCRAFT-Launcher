<script lang="ts">
  import { Languages } from "lucide-svelte";
  import { i18n } from "../stores/i18n.svelte";

  
  let isOpen = $state(false);

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function selectLang(lang: "en-US" | "pt-BR" | "es-ES") {
    i18n.setLang(lang);
    isOpen = false;
  }
</script>

<div class="lang-container">
  <button class="lang-toggle" onclick={toggleMenu} title="Mudar Idioma">
    <Languages size={20} color="white" />
  </button>

  {#if isOpen}
    <div class="lang-menu">
      <button onclick={() => selectLang("pt-BR")}>Português</button>
      <button onclick={() => selectLang("en-US")}>English</button>
      <button onclick={() => selectLang("es-ES")}>Español</button>
    </div>
  {/if}
</div>

<style>
  .lang-container {
    position: relative;
    display: inline-block;
  }

  .lang-toggle {
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

  .lang-toggle:hover {
    background: var(--color-border);
    transform: scale(1.05);
  }

  .lang-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: var(--spacing-sm);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 120px;
    z-index: 100;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }

  .lang-menu button {
    background: transparent;
    border: none;
    color: var(--color-text-main);
    text-align: left;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  .lang-menu button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
</style>
