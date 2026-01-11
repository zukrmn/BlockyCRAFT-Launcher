<script lang="ts">
  interface Props {
    children?: any;
    onclick?: (e: MouseEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "secondary" | "danger";
    class?: string;
  }

  let {
    children,
    onclick = () => {},
    disabled = false,
    loading = false,
    variant = "primary",
    class: className = "",
  }: Props = $props();
</script>

<button
  class="btn btn-{variant} {className}"
  {disabled}
  aria-busy={loading}
  {onclick}
>
  {#if loading}
    <span class="spinner"></span>
    <span class="loading-text">{@render children?.()}</span>
  {:else}
    {@render children?.()}
  {/if}
</button>

<style>
  .btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
    overflow: hidden;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.5);
  }

  /* Primary */
  .btn-primary {
    background: linear-gradient(
      135deg,
      var(--color-emerald) 0%,
      var(--color-emerald-dim) 100%
    );
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  /* Secondary */
  .btn-secondary {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-primary);
    border-color: var(--border-glass);
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Spinner */
  .spinner {
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
