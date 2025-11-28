// ------------------------------------------------------------
// mapEvents.js — FYTRUP Alpha10 (Persistent User Tracking)
// Works with persistent mapCore + persistent MapView
// • Single geolocation watcher for entire session
// • Marker persists across camera toggles
// • Recenter button always targets current marker
// • GitHub Pages–safe
// ------------------------------------------------------------

import { base } from "$app/paths";

let GEO_WATCH_ID = null;          // persistent geolocation watcher
let USER_MARKER = null;           // persistent user marker
let RECENTER_HANDLER_SET = false; // prevent duplicate listeners

export async function watchUserLocation(map, updateUserMarker, recenterButton) {
  const L = await import("leaflet");

  // ------------------------------------------------------------
  // Create (or update) the persistent user marker
  // ------------------------------------------------------------
  function placeUser(lat, lng) {
    const icon = L.icon({
      iconUrl: `${base}/icons/UserLocation.png`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      className: "fytrup-user-marker"
    });

    if (!USER_MARKER) {
      USER_MARKER = L.marker([lat, lng], { icon }).addTo(map);
    } else {
      USER_MARKER.setLatLng([lat, lng]);
      // If marker got removed by a remount, re-add it
      if (!map.hasLayer(USER_MARKER)) {
        USER_MARKER.addTo(map);
      }
    }

    updateUserMarker(USER_MARKER);
  }

  // ------------------------------------------------------------
  // Start geolocation watcher ONCE for entire app lifetime
  // ------------------------------------------------------------
  if (GEO_WATCH_ID === null) {
    GEO_WATCH_ID = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        placeUser(lat, lng);
      },
      (err) => {
        console.warn("GPS error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 8000
      }
    );
  }

  // ------------------------------------------------------------
  // Attach recenter button listener ONCE
  // ------------------------------------------------------------
  if (!RECENTER_HANDLER_SET) {
    recenterButton.addEventListener("click", () => {
      if (USER_MARKER && map) {
        map.flyTo(USER_MARKER.getLatLng(), 17, { duration: 0.9 });
      }
    });

    RECENTER_HANDLER_SET = true;
  }

  // ------------------------------------------------------------
  // Cleanup returned to MapView.svelte
  // But we DO NOT clear geolocation globally here.
  // Only return a no-op to satisfy the calling contract.
  // ------------------------------------------------------------
  return () => {};
}
