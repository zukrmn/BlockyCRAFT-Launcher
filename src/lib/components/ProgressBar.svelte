<script lang="ts">
  interface Props {
    progress: number; // 0 to 100
    status?: string;
    class?: string;
  }

  let { progress = 0, status = "", class: className = "" }: Props = $props();
</script>

<div class="progress-container {className}">
  <div class="bar-bg">
    <div
      class="bar-fill"
      style="width: {Math.min(100, Math.max(0, progress))}%"
    ></div>
  </div>
  {#if status}
    <div class="status">
      <span class="status-text">{status}</span>
      <span class="percentage">{Math.round(progress)}%</span>
    </div>
  {/if}
</div>

<style>
  .progress-container {
    width: 100%;
  }

  .bar-bg {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--color-emerald);
    box-shadow: 0 0 12px var(--color-emerald);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .status {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  .percentage {
    font-variant-numeric: tabular-nums;
  }
</style>
