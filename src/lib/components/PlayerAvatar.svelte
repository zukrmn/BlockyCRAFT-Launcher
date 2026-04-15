<script lang="ts">
  interface Props {
    username: string;
    size?: number;
    alt?: string;
  }

  let { username, size = 48, alt = "" }: Props = $props();

  let hasError = $state(false);
  let isInternalLoaded = $state(false);
  let isLoading = $state(true);

  // URLs
  const internalUrl = $derived(`https://talk.craft.blocky.com.br/api/v1/profile/${username}.png`);
  const minotarUrl = $derived(`https://minotar.net/avatar/${username}/${size}`);
  
  // State management for loading
  function handleInternalLoad() {
    isInternalLoaded = true;
    isLoading = false;
  }

  function handleInternalError() {
    hasError = true;
    isInternalLoaded = false;
    // We don't set isLoading to false here, because we want it to show while minotar loads
  }

  function handleMinotarLoad() {
    isLoading = false;
  }
</script>

<div 
  class="avatar-container" 
  style:width="{size}px" 
  style:height="{size}px"
  class:loading={isLoading}
>
  {#if !hasError}
    <!-- Internal Skin (Needs Crop) -->
    <div class="crop-wrapper">
      <img 
        src={internalUrl} 
        alt={alt || username}
        class="internal-skin"
        onload={handleInternalLoad}
        onerror={handleInternalError}
      />
    </div>
  {:else}
    <!-- Minotar Fallback (Already Cropped) -->
    <img 
      src={minotarUrl} 
      alt={alt || username}
      class="minotar-skin"
      onload={handleMinotarLoad}
    />
  {/if}

  {#if isLoading}
    <div class="shimmer"></div>
  {/if}
</div>

<style>
  .avatar-container {
    position: relative;
    border-radius: var(--radius-md);
    background: var(--color-bg-input);
    overflow: hidden;
    flex-shrink: 0;
  }

  .crop-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  /* 
     Minecraft Skin Head Crop:
     The head front is at [8, 8] with size 8x8.
     If we want that 8x8 to fill the 100% of container:
     - The image must be 800% of the container width (64/8 = 8).
     - The offset must be -100% (which moves 8 pixels in the 64px space).
  */
  .internal-skin {
    position: absolute;
    width: 800%;
    height: auto;
    left: -100%;
    top: -100%;
    image-rendering: pixelated;
    display: block;
  }

  .minotar-skin {
    width: 100%;
    height: 100%;
    display: block;
    image-rendering: pixelated;
  }

  .shimmer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer-anim 1.5s infinite;
  }

  @keyframes shimmer-anim {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .loading {
    opacity: 0.7;
  }
</style>
