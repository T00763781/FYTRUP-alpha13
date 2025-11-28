// ------------------------------------------------------------
// appState.js — FYTRUP Alpha12 Global Shell State
// Central store for:
//   • Map / Camera mode
//   • Chat messages
//   • QR system message routing
//   • Contact profile overlay (NEW)
//   • UI flags (sheets, keyboard, overlays)
// ------------------------------------------------------------

import { writable } from "svelte/store";

export const appState = writable({
  // ------------------------------------------------------------
  // CAMERA / MAP MODE
  // ------------------------------------------------------------
  showCamera: false,

  // ------------------------------------------------------------
  // CHAT MESSAGES
  // Format: { role: "wolfie" | "atlas" | "user" | "system", text }
  // ------------------------------------------------------------
  messages: [
    {
      role: "system",
      text: "Pack Chat mobile shell initialized."
    },
    {
      role: "wolfie",
      text: "Hey Packmate — I’ll show you around campus once chat logic is live."
    }
  ],

  // ------------------------------------------------------------
  // PERSONA STATE (Future: Packmates in Pack Chat)
  // ------------------------------------------------------------
  activePersona: "wolfie",

  // ------------------------------------------------------------
  // CONTACT OVERLAY (NEW)
  // If not null → ContactHeroOverlay is shown
  // ------------------------------------------------------------
  activeContact: null,

  // ------------------------------------------------------------
  // UI FLAGS
  // ------------------------------------------------------------
  keyboardOpen: false,
  bottomSheetOpen: false,
  overlayVisible: false
});

// ------------------------------------------------------------
// QR SYSTEM MESSAGE HELPERS
// ------------------------------------------------------------

export function systemMessage(text) {
  appState.update((s) => ({
    ...s,
    messages: [...s.messages, { role: "system", text }]
  }));
}

// ------------------------------------------------------------
// NOTE-EVENT ROUTER
// Called by layout → handleQR(e.detail)
// ------------------------------------------------------------

export function noteEvent(type) {
  switch (type) {
    case "invalid":
      systemMessage("No valid note detected.");
      break;

    case "duplicate":
      systemMessage("Note already uploaded.");
      break;

    case "added":
      systemMessage("New note added.");
      break;

    default:
      systemMessage("Unknown scanner response.");
      break;
  }
}

// ------------------------------------------------------------
// CONTACT OVERLAY HELPERS (NEW)
// ------------------------------------------------------------

export function openContact(mate) {
  appState.update((s) => ({
    ...s,
    activeContact: mate
  }));
}

export function closeContact() {
  appState.update((s) => ({
    ...s,
    activeContact: null
  }));
}
