// storage.js — localStorage tracking (SSR-safe)
import { browser } from "$app/environment";

function safeGet() {
  if (!browser) return [];
  try {
    return JSON.parse(localStorage.getItem("fytrup-notes") || "[]");
  } catch {
    return [];
  }
}

function safeSet(arr) {
  if (!browser) return;
  localStorage.setItem("fytrup-notes", JSON.stringify(arr));
}

export function getAllNotes() {
  return safeGet();
}

export function hasNote(id) {
  const arr = safeGet();
  return arr.includes(id);
}

export function addNote(id) {
  if (!browser) return;

  const arr = safeGet();
  if (!arr.includes(id)) {
    arr.push(id);
    safeSet(arr);
  }
}
