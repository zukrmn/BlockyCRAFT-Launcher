<script lang="ts">
  import { gameState } from '../stores/launcher';

  let username = $state(''); // Svelte 5 rune
  let loading = $derived($gameState !== 'IDLE'); // Svelte 5 rune

  let { onPlay } = $props<{ onPlay: (name: string) => void }>();

  function handleSubmit() {
    if (username.trim() && !loading) {
      onPlay(username);
    }
  }
</script>

<div class="w-full max-w-md bg-zinc-900/40 backdrop-blur-md rounded-xl border border-white/10 p-8 shadow-2xl flex flex-col gap-6">
  <div class="text-center">
    <h1 class="font-minecraft text-4xl text-white drop-shadow-md mb-2">BlockyCRAFT</h1>
    <p class="text-zinc-400 text-sm tracking-wide uppercase">Geopolitics Beta 1.7.3</p>
  </div>

  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="username" class="text-xs uppercase font-bold text-zinc-500 tracking-wider ml-1">Username</label>
      <input
        id="username"
        type="text"
        bind:value={username}
        placeholder="Steve"
        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium"
        disabled={loading}
      />
    </div>

    <button
      onclick={handleSubmit}
      disabled={!username || loading}
      class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] uppercase tracking-wide"
    >
      {loading ? 'Iniciando...' : 'JOGAR'}
    </button>
  </div>
</div>
