<script lang="ts">
  import { i18n } from "../stores/i18n.svelte";

  // Mock data for now
  let donators = [
    { name: "LimaooDoomer", uuid: "ec01c71e-3f62-421f-8255-0814467332d7" },
    { name: "Katiau", uuid: "uuid-katiau" },
    { name: "Henriquezando", uuid: "uuid-henriquezando" },
    { name: "Alberto", uuid: "uuid-alberto" },
    { name: "Epstein", uuid: "uuid-epstein" },
  ];
</script>

<div class="donators-panel">
  <h3>{i18n.t("ui.donators")}</h3>
  <div class="grid">
    {#each donators as donor}
      <div class="donor-item" title={donor.name}>
        <img 
          src="https://minotar.net/avatar/{donor.name}/64" 
          alt={donor.name}
          loading="lazy"
        />
        <span class="donor-name">{donor.name}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .donators-panel {
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
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: var(--spacing-md);
  }

  .donor-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  img {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--color-bg-input);
    image-rendering: pixelated; /* Minecraft style */
  }

  .donor-name {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
</style>
