<script lang="ts">
  import { i18n } from "../stores/i18n.svelte";
</script>

<div class="changelog-panel">
  <h2>{i18n.t("ui.changelog")}</h2>
  <div class="content">
    <h3>Site offline a partir de amanhã 29/12</h3>
    <p>O site do BlockyCRAFT entrará em manutenção nessa segunda-feira 29/12.</p>
    
    <h4>Não será possível:</h4>
    <ul>
      <li>Depositar e sacar itens</li>
      <li>Utilizar o mapa</li>
    </ul>

    <p>Tanto o servidor de Minecraft quanto o chat de voz permanecerão funcionando normalmente, já que migramos ele para outra máquina recentemente.</p>
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
    color: var(--color-text-muted);
    letter-spacing: 0.05em;
  }

  /* Content Styling */
  .content {
    color: #e2e8f0;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .content h3 {
    font-size: 1.1rem;
    color: var(--color-primary);
    margin: 0 0 var(--spacing-sm) 0;
  }

  .content h4 {
    font-size: 1rem;
    color: #cbd5e1;
    margin: var(--spacing-md) 0 var(--spacing-xs) 0;
  }

  .content p {
    margin-bottom: var(--spacing-md);
  }

  .content ul {
    list-style: disc;
    padding-left: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    color: #cbd5e1;
  }

  .content li {
    margin-bottom: 4px;
  }
</style>
