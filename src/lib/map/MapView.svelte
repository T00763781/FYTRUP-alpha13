<!-- ------------------------------------------------------------
     MAPVIEW.SVELTE — FYTRUP Alpha12
     • Persistent Leaflet map with camera toggle safety
     • Invalidates size after camera closes (critical)
     • Recenter button moved to top-right (icon only)
------------------------------------------------------------- -->

<script>
  import { onMount, onDestroy } from "svelte";
  import { base } from "$app/paths";
  import { appState } from "$lib/state/appState.js";

  let map;
  let mapContainer;
  let recenterButton;
  let userMarker;

  let initMapCore;
  let initPOIMarkers;
  let watchUserLocation;

  let cleanup = () => {};

  // Store subscription
  let state = {};
  const unsub = appState.subscribe((v) => {
    state = v;

    // When camera closes, force Leaflet to recalc size
    if (map && v.showCamera === false) {
      requestAnimationFrame(() => map.invalidateSize(true));
    }
  });

  onMount(async () => {
    const core = await import("./mapCore.js");
    const poi = await import("./poiMarkers.js");
    const loc = await import("./mapEvents.js");

    initMapCore = core.initMapCore;
    initPOIMarkers = poi.initPOIMarkers;
    watchUserLocation = loc.watchUserLocation;

    // Initialize Leaflet map
    map = await initMapCore(mapContainer);
    initPOIMarkers(map);

    // User location + recenter button integration
    try {
      const result = watchUserLocation(
        map,
        (m) => (userMarker = m),
        recenterButton
      );
      cleanup = typeof result === "function" ? result : () => {};
    } catch (err) {
      console.warn("FYTRUP: watchUserLocation failed:", err);
      cleanup = () => {};
    }

    // Safety invalidate (first paint)
    setTimeout(() => map.invalidateSize(true), 150);
  });

  onDestroy(() => {
    unsub();
    try {
      cleanup();
    } catch (err) {
      console.warn("FYTRUP: Map cleanup skipped:", err);
    }
  });
</script>

<style>
  .map-shell {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10;
  }

  :global(.leaflet-container) {
    width: 100% !important;
    height: 100% !important;
    z-index: 10;
    touch-action: pan-x pan-y pinch-zoom;
  }

  :global(.leaflet-marker-icon) {
    z-index: 20 !important;
  }

  :global(path.leaflet-interactive) {
    z-index: 30 !important;
  }

  :global(.fytrup-user-marker) {
    z-index: 30 !important;
  }

  /* ----------------------------------------------
     ICON-ONLY TOP-RIGHT RECENTER BUTTON
  ---------------------------------------------- */
  .recenter-btn {
    position: absolute;

    top: calc(12px + env(safe-area-inset-top));
    right: 12px;

    width: 42px;
    height: 42px;

    display: flex;
    justify-content: center;
    align-items: center;

    background: none;
    border: none;
    padding: 0;
    margin: 0;

    cursor: pointer;
    z-index: 40;

    transition: transform 0.15s ease;
  }

  .recenter-btn:active {
    transform: scale(0.85);
  }

  .recenter-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.95;

    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));
  }
</style>

<!-- Map container -->
<div class="map-shell" bind:this={mapContainer}></div>

<!-- Floating recenter button -->
<div class="recenter-btn" bind:this={recenterButton}>
  <img src={`${base}/icons/Recenter.png`} alt="recenter" />
</div>
