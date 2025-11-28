// ------------------------------------------------------------
// CONTACTS STATE — Alpha12 (Clean, Final, Fully Working)
// ------------------------------------------------------------
import { writable } from "svelte/store";

// --- Load saved state (or initialize empty) ---
let saved;
if (typeof localStorage !== "undefined") {
  saved = JSON.parse(localStorage.getItem("fytrup-contacts") || "{}");
} else {
  saved = {};
}

// --- Ensure Wolfie is always unlocked ---
if (!saved["wolfie"]) {
  saved["wolfie"] = true;
}

// --- Create writable store with saved values ---
const store = writable(saved);

// --- Persist helper ---
function persist(v) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("fytrup-contacts", JSON.stringify(v));
  }
}

// --- Public API ---
export const contactsState = {
  subscribe: store.subscribe,

  unlock(id) {
    store.update(s => {
      const next = { ...s, [id]: true };
      persist(next);
      return next;
    });
  },

  isUnlocked(id) {
    let current;
    store.subscribe(v => (current = v))(); // immediate unsubscribe call
    return current[id] === true;
  }
};
