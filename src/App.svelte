<script lang="ts">
  import { onMount } from "svelte";
  import Background from "./components/Background.svelte";
  import LoginCard from "./components/LoginCard.svelte";
  import ProgressBar from "./components/ProgressBar.svelte";
  import {
    gameState,
    downloadProgress,
    statusMessage,
    addLog,
    logs,
  } from "./stores/launcher";
  import "./app.css";

  function handlePlay(username: string) {
    if (window.api) {
      // Real Electron Integration
      gameState.set("PREPARING");
      window.api.launchGame({ username });
    } else {
      // Mock Mode
      console.log("Starting Mock Mode...");
      gameState.set("DOWNLOADING");
      statusMessage.set("Iniciando download...");
      addLog("[INIT] Mock Mode Initiated");

      let progress = 0;
      downloadProgress.set(0);

      const interval = setInterval(() => {
        progress += 2;
        downloadProgress.set(progress);

        // Simulating logs
        if (progress % 10 === 0 && progress < 100) {
          const fakeLogs = [
            "Baixando minecraft.jar...",
            "Verificando assets...",
            "Atualizando bibliotecas...",
            "Descompactando nativos...",
            "Validando hash...",
          ];
          const log = fakeLogs[Math.floor(progress / 20) % fakeLogs.length];
          statusMessage.set(log);
          addLog(`[INFO] ${log}`);
        }

        if (progress >= 100) {
          clearInterval(interval);
          // Small delay to ensure progress bar looks full before switch
          setTimeout(() => {
            gameState.set("PLAYING");
            statusMessage.set("Jogo iniciado!");
            addLog("[INFO] Launching game instance...");
          }, 500);
        }
      }, 100);
    }
  }

  onMount(() => {
    if (window.api) {
      window.api.onProgress((data) => {
        downloadProgress.set((data.current / data.total) * 100);
        statusMessage.set(
          `Baixando... ${(data.current / 1024 / 1024).toFixed(1)}MB / ${(data.total / 1024 / 1024).toFixed(1)}MB`,
        );
      });
      window.api.onLog(addLog);
      window.api.onError((err) => {
        gameState.set("ERROR");
        statusMessage.set(`Erro: ${err}`);
      });
    }
  });
</script>

<main
  class="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden font-sans text-white"
>
  <Background />

  <div
    class="z-10 w-full max-w-md flex flex-col items-center gap-8 animate-fade-in-up"
  >
    {#if $gameState === "IDLE"}
      <LoginCard onPlay={handlePlay} />
    {:else}
      <div
        class="w-full bg-zinc-900/60 backdrop-blur-md rounded-xl p-6 border border-white/10 flex flex-col gap-4 text-center shadow-2xl"
      >
        <h2 class="text-2xl font-minecraft mb-2">BlockyCRAFT</h2>

        {#if $gameState === "PLAYING"}
          <div
            class="flex flex-col items-center justify-center py-8 gap-4 animate-in fade-in zoom-in duration-500"
          >
            <div
              class="text-emerald-400 font-bold text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
            >
              JOGO EM EXECUÇÃO
            </div>
            <p class="text-zinc-400 text-sm">
              A janela do jogo deve abrir em instantes...
            </p>
          </div>
        {:else if $gameState === "ERROR"}
          <div
            class="text-red-400 font-bold p-4 border border-red-500/20 rounded bg-red-500/10"
          >
            {$statusMessage}
          </div>
        {:else}
          <ProgressBar />
          <div
            class="h-32 bg-black/50 rounded p-2 text-left text-xs font-mono text-zinc-400 overflow-y-auto flex flex-col-reverse"
          >
            {#each [...$logs].reverse() as log}
              <div
                class="whitespace-pre-wrap py-0.5 border-b border-white/5 last:border-0"
              >
                {log}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</main>
