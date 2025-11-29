// ------------------------------------------------------------
// mapCore.js — FYTRUP Alpha13 (Voyager Pastel Storybook Theme)
// ------------------------------------------------------------

let MAP_INSTANCE = null;
let TILE_LAYER_ADDED = false;
let L_ref = null;

function bindMapToContainer(map, container) {
  map._container = container;
  container._leaflet_id = map._containerId;

  setTimeout(() => {
    map.invalidateSize(true);
  }, 60);
}

export async function initMapCore(container) {
  if (!L_ref) {
    L_ref = await import("leaflet");
    await import("leaflet/dist/leaflet.css");
  }

  const L = L_ref;

  // Rebind existing map
  if (MAP_INSTANCE) {
    bindMapToContainer(MAP_INSTANCE, container);
    return MAP_INSTANCE;
  }

  // Create fresh map instance
  const map = L.map(container, {
    zoomControl: false,
    attributionControl: false,
    minZoom: 13,
    maxZoom: 19,
    inertia: true,
    inertiaDeceleration: 3400,
    wheelDebounceTime: 40
  });

  MAP_INSTANCE = map;

  // TRU campus center
  const defaultCenter = [50.671, -120.365];
  map.setView(defaultCenter, 16);

  // ------------------------------------------------------------
  // LEVEL 2 TILESET — CARTO VOYAGER (storybook pastel)
  // ------------------------------------------------------------
  if (!TILE_LAYER_ADDED) {
    const tileURL =
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileURL, {
      subdomains: "abcd",
      maxZoom: 19,
      tileSize: 256,
      keepBuffer: 6,
      attribution:
        '&copy; OSM contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    TILE_LAYER_ADDED = true;
  }

  setTimeout(() => map.invalidateSize(true), 200);

  return map;
}
