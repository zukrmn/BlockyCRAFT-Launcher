<script lang="ts">
  import { i18n } from "../stores/i18n.svelte";
  import { ElectronService } from "../electron";
  import { donatorsStore } from "../stores/donators.svelte";

  let donators = $state<{ name: string }[]>([]);
  let isLoading = $state(true);

  const DONATORS_URL = "https://craft.blocky.com.br/launcher-assets/donators.json";

  async function fetchDonators() {
    try {
        const fullUrl = DONATORS_URL + '?t=' + Date.now();
        const res = await ElectronService.fetchUrl(fullUrl);
        
        if (!res.success || !res.data) throw new Error(res.error || "Fetch failed");
        
        const data = JSON.parse(res.data);
        
        if (Array.isArray(data)) {
            donators = data.map((item: any) => {
                // Support ["Name"] or [{ username: "Name" }] or [{ name: "Name" }]
                const name = typeof item === 'string' ? item : (item.username || item.name);
                return { name };
            }).filter(d => d.name); // Filter empty
            
            // Populate the shared donators store
            donatorsStore.set(donators.map(d => d.name));
        }
    } catch (e) {
        console.error("Failed to load donators:", e);
        // Fallback or empty state
        donators = [];
        donatorsStore.set([]);
    } finally {
        isLoading = false;
    }
  }

  $effect(() => {
    fetchDonators();
  });

  function openScoreboard() {
    ElectronService.openExternal("https://craft.blocky.com.br/scoreboard/");
  }
</script>


<div class="donators-panel smart-scroll">
  <h3>{i18n.t("ui.donators")}</h3>
  <div class="grid">
    {#if isLoading}
        <div class="loading">Loading...</div>
    {:else}
        {#each donators as donor}
        <!-- Converting div to button for accessibility and interaction -->
        <button class="donor-item" title={donor.name} onclick={openScoreboard}>
            <img 
            src="https://minotar.net/avatar/{donor.name}/64" 
            alt={donor.name}
            loading="lazy"
            />
            <span class="donor-name">{donor.name}</span>
        </button>
        {/each}
    {/if}
  </div>
</div>

<style>
  .donators-panel {
    background: rgba(30, 30, 30, var(--panel-opacity));
    backdrop-filter: blur(var(--panel-blur));
    -webkit-backdrop-filter: blur(var(--panel-blur));
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    height: 100%;
    overflow-y: auto;
  }

  @keyframes shine {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: -200% center;
    }
  }

  h3 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    /* Golden Gradient with Shine Animation - Cyclic for seamless loop */
    background: linear-gradient(
      to right, 
      #bf953f 0%, 
      #fcf6ba 40%,
      #ffffff 50%,
      #fcf6ba 60%,
      #bf953f 100%
    );
    background-size: 200% auto;
    
    color: #bf953f; /* Fallback */
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    animation: shine 2s linear infinite;
    display: inline-block;
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
    /* Reset button styles */
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .donor-item:hover {
      transform: translateY(-2px);
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
