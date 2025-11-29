// ------------------------------------------------------------
// mapCore.js — FYTRUP Alpha13 (Pastel Adventure Map Theme)
// • Map is created ONCE and reused across all MapView mounts
// • Container can be reattached cleanly after camera toggles
// • GitHub Pages–safe, SSR-safe dynamic imports
// ------------------------------------------------------------

let MAP_INSTANCE = null;
let TILE_LAYER_ADDED = false;
let L_ref = null;

/**
 * Rebinds the Leaflet map to a new container without recreating it.
 */
function bindMapToContainer(map, container) {
  // Move map's internal container reference
  map._container = container;
  container._leaflet_id = map._containerId;

  // Force reflow so Leaflet recalculates geometry
  setTimeout(() => {
    map.invalidateSize(true);
  }, 60);
}

export async function initMapCore(container) {
  // Load Leaflet (once)
  if (!L_ref) {
    L_ref = await import("leaflet");
    await import("leaflet/dist/leaflet.css");
  }

  const L = L_ref;

  // ------------------------------------------------------------
  // CASE 1 — Map already exists → REBIND and return
  // ------------------------------------------------------------
  if (MAP_INSTANCE) {
    bindMapToContainer(MAP_INSTANCE, container);
    return MAP_INSTANCE;
  }

  // ------------------------------------------------------------
  // CASE 2 — First-time initialization: Create map
  // ------------------------------------------------------------
  const map = L.map(container, {
    zoomControl: false,
    attributionControl: false,
    minZoom: 13,
    maxZoom: 19,
    inertia: true,
    inertiaDeceleration: 3400,
    wheelDebounceTime: 40,
    preferCanvas: false
  });

  MAP_INSTANCE = map;

  // Default TRU campus center
  const defaultCenter = [50.671, -120.365];
  const defaultZoom = 16;

  map.setView(defaultCenter, defaultZoom);

  // ------------------------------------------------------------
  // Add tiles ONCE globally — PASTEL ADVENTURE TILESET
  // ------------------------------------------------------------
  if (!TILE_LAYER_ADDED) {
    const tileURL =
      "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=32300e86-80f3-47fd-8046-6ec4891cac16";

    L.tileLayer(tileURL, {
      maxZoom: 19,
      tileSize: 256,
      keepBuffer: 6,
      updateWhenIdle: false,
      updateWhenZooming: true,
      attribution:
        '© <a href="https://www.openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    TILE_LAYER_ADDED = true;
  }

  // First-time size fix
  setTimeout(() => map.invalidateSize(true), 200);

  return map;
}
