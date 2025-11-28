// ------------------------------------------------------------
// poiMarkers.js — FYTRUP Alpha12 (GitHub Pages–safe)
// • Uses poi.ts + packmates.js
// • Case-safe, base-safe, SSR-safe
// ------------------------------------------------------------

import { base } from "$app/paths";

// MUST MATCH EXACT FILE NAMES (lowercase + correct extensions)
import PACKMATES from "$lib/data/packmates.js";
import { POIS } from "$lib/data/poi.ts";

// ------------------------------------------------------------
// MARKER ICONS
// ------------------------------------------------------------
const ICONS = {
  unseen: `${base}/icons/marker_unseen.png`,
  visited: `${base}/icons/marker_visited.png`,
  completed: `${base}/icons/marker_completed.png`
};

function iconForState(state) {
  return ICONS[state] || ICONS.unseen;
}

// ------------------------------------------------------------
// BUILD AVATAR LOOKUP FROM PACKMATES
// ------------------------------------------------------------
const avatarFor = Object.fromEntries(
  PACKMATES.map((p) => [p.id, `${base}${p.avatar}`])
);

// ------------------------------------------------------------
// LOCAL STORAGE STATE
// ------------------------------------------------------------
function getState(id) {
  return localStorage.getItem("poi-" + id) || "unseen";
}

function saveState(id, state) {
  localStorage.setItem("poi-" + id, state);
}

// ------------------------------------------------------------
// MAIN INITIALIZER
// ------------------------------------------------------------
export async function initPOIMarkers(map) {
  const L = await import("leaflet");

  POIS.forEach((poi) => {
    const state = getState(poi.id);

    // Marker icon
    const icon = L.icon({
      iconUrl: iconForState(state),
      iconSize: [44, 44],
      iconAnchor: [22, 44]
    });

    const marker = L.marker([poi.lat, poi.lng], { icon }).addTo(map);

    // Persona avatar from PACKMATES
    const avatar = avatarFor[poi.packmateId];

    const popupHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        <img src="${avatar}"
             style="width:42px;height:42px;border-radius:50%;" />
        <div>
          <strong>${poi.packmateId.toUpperCase()}</strong><br/>
          <span style="opacity:.8;font-size:14px;">Tap to explore</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupHTML);

    // Update marker when tapped
    marker.on("click", () => {
      if (getState(poi.id) === "unseen") {
        saveState(poi.id, "visited");

        marker.setIcon(
          L.icon({
            iconUrl: iconForState("visited"),
            iconSize: [44, 44],
            iconAnchor: [22, 44]
          })
        );
      }
    });
  });
}
