<script lang="ts">
  import { Globe } from "lucide-svelte";
  
  let currentLang = $state("pt-BR");

  function toggleLanguage() {
    currentLang = currentLang === "pt-BR" ? "en-US" : "pt-BR";
    // Logic to switch language context would go here
  }
</script>

<button class="lang-toggle" onclick={toggleLanguage} title="Mudar Idioma">
  <Globe size={20} color="white" />
</button>

<style>
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
</style>
