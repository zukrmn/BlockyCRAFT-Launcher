<script lang="ts">
  interface Props {
    value: string;
    placeholder?: string;
    label?: string;
    type?: string;
    class?: string;
    id?: string;
    onkeypress?: (e: KeyboardEvent) => void;
  }

  let {
    value = $bindable(),
    placeholder = "",
    label = "",
    type = "text",
    class: className = "",
    id = `input-${Math.random().toString(36).slice(2)}`,
    onkeypress = () => {},
  }: Props = $props();
</script>

<div class="input-group {className}">
  {#if label}
    <label class="label" for={id}>{label}</label>
  {/if}
  <input
    {id}
    {type}
    {placeholder}
    bind:value
    class="input"
    spellcheck="false"
    {onkeypress}
  />
</div>

<style>
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .label {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    font-weight: 500;
    margin-left: 4px;
  }

  .input {
    width: 100%;
    padding: 1rem 1.25rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-md);
    color: white;
    font-size: 1rem;
    outline: none;
    transition: all var(--transition-fast);
  }

  .input:focus {
    border-color: var(--color-emerald);
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }
</style>
