// ------------------------------------------------------------
// classifier.js — FYTRUP Alpha12
// • Handles scanning of POI/packmate-specific note IDs
// • Compatible with notes.ts object structure
// • Accepts messy QR text and resolves to packmate-index IDs
// ------------------------------------------------------------

import { NOTES } from "./notes.js";
import { hasNote, addNote } from "./storage.js";

/**
 * Convert raw QR strings into canonical IDs like:
 *   "wolfie-1"
 *   "voxel-2"
 *   "echo-3"
 *
 * Accepts variants like:
 *   "Wolfie1", "WOLFIE-01", " voxel_3 ", "summit02"
 */
function normalize(raw) {
  if (!raw || typeof raw !== "string") return "";

  let v = raw.trim().toLowerCase();

  // extract letters (packmate id)
  let letters = v.replace(/[^a-z]/g, "");
  // extract digits
  let digits = v.replace(/[^0-9]/g, "");

  if (!letters || !digits) return "";

  // trim leading zeros (keep at least 1 digit)
  const idx = String(parseInt(digits, 10));

  return `${letters}-${idx}`;
}

export function classifyNote(raw) {
  const id = normalize(raw);

  if (!id) return { status: "invalid", id: null };

  if (!NOTES[id]) {
    return { status: "unknown", id };
  }

  if (hasNote(id)) {
    return { status: "duplicate", id };
  }

  addNote(id);
  return { status: "added", id };
}
