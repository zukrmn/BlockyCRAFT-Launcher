<script lang="ts">
  import { downloadProgress, statusMessage } from '../stores/launcher';
</script>

<div class="w-full max-w-2xl mx-auto flex flex-col gap-2 p-4">
  <div class="flex justify-between items-end px-1">
    <span class="text-zinc-300 text-sm font-medium">{$statusMessage}</span>
    <span class="text-emerald-400 text-xs font-mono">{$downloadProgress.toFixed(1)}%</span>
  </div>
  
  <div class="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden backdrop-blur-sm">
    <div
      class="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300 ease-out"
      style:width="{$downloadProgress}%"
    ></div>
  </div>
</div>
