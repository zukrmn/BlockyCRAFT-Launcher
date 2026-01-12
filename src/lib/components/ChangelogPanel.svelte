<script lang="ts">
  import { i18n } from "../stores/i18n.svelte";

  // Mock changelog data
  const updates = [
    { version: "1.0.0", date: "2024-05-20", title: "Lançamento Oficial" },
    { version: "0.9.5", date: "2024-05-18", title: "Correções de bugs" },
    { version: "0.9.0", date: "2024-05-15", title: "Novo sistema de login" },
  ];
</script>

<div class="changelog-panel">
  <h2>{i18n.t("ui.changelog")}</h2>
  <div class="list">
    {#each updates as update}
      <div class="update-item">
        <div class="update-header">
          <span class="version">{update.version}</span>
          <span class="date">{update.date}</span>
        </div>
        <div class="update-title">{update.title}</div>
      </div>
    {/each}
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
  }
  h2 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-primary);
    letter-spacing: 0.05em;
  }
</style>
