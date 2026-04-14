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
    padding: 10px 12px;
    background: var(--color-bg-input);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: white;
    font-size: 0.95rem;
    outline: none;
    transition: all var(--transition-fast);
  }

  .input:focus {
    border-color: white;
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }
</style>
