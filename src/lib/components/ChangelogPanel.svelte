<script lang="ts">
  let changelog = [
    "Adicionado Chat de Voz por Proximidade",
    "Novo Sistema de Skins (Mod Client-side)",
    "Correção de bugs na renderização de chunks",
    "Melhoria na estabilidade do servidor",
    "Adicionado suporte a Wayland (Linux)"
  ];
</script>

<div class="changelog-panel">
  <h3>Novidades</h3>
  <ul>
    {#each changelog as item}
      <li>• {item}</li>
    {/each}
  </ul>
</div>

<style>
  .changelog-panel {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    height: 100%;
    overflow-y: auto;
  }

  h3 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  li {
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--color-text-main);
  }
</style>
