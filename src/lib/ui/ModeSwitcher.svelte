<!-- ------------------------------------------------------------
     MODESWITCHER.SVELTE — FYTRUP Alpha12 (GH Pages Safe)
     Purpose:
       • Toggle MapView ↔ CameraView
       • Fully SSR-safe via onMount dynamic imports
       • Zero static asset paths (GH Pages safe)
------------------------------------------------------------- -->

<script>
  import { onMount } from "svelte";

  export let showCamera = false;

  let MapView = null;
  let CameraView = null;

  let loaded = false;

  onMount(async () => {
    // SSR-safe, only runs in browser
    const mapMod = await import("$lib/map/MapView.svelte");
    const camMod = await import("$lib/camera/CameraView.svelte");

    MapView = mapMod.default;
    CameraView = camMod.default;

    loaded = true;
  });
</script>

{#if !loaded}
  <div class="loading-shell">Loading…</div>
{:else}
  {#if showCamera}
    <CameraView />
  {:else}
    <MapView />
  {/if}
{/if}

<style>
  .loading-shell {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 1rem;
    opacity: 0.65;
    color: var(--text-primary);
  }
</style>
