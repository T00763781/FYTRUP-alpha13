// ------------------------------------------------------------
// CHAT STATE — FYTRUP Alpha12
// Central message store for Wolfie + user + system messages
// ------------------------------------------------------------

import { writable } from "svelte/store";

// Initial Wolfie greeting
const initialMessages = [
  {
    role: "wolfie",
    text: "Hey Packmate — I’ll show you around campus once chat logic is live."
  }
];

function createChatState() {
  const { subscribe, update, set } = writable(initialMessages);

  return {
    subscribe,

    // Push a user message
    sendUserMessage(text) {
      update(list => [...list, { role: "user", text }]);
    },

    // Push a persona/system message
    sendMessage(role, text) {
      update(list => [...list, { role, text }]);
    },

    // Fully reset the chat
    reset() {
      set(initialMessages);
    }
  };
}

export const chatState = createChatState();
