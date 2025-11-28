<!-- ------------------------------------------------------------
     CHATSHELL.SVELTE — FYTRUP Alpha12 (FooterTray Safe)
     PURPOSE:
       • Render persona messages
       • Auto-scroll to bottom
       • Keep bubbles clear of FooterTray
       • Prevent horizontal scroll entirely
------------------------------------------------------------- -->

<script>
  import { onMount, afterUpdate } from "svelte";
  import Message from "./Message.svelte";
  import { base } from "$app/paths";

  export let messages = [];

  let container;

  /* Persona registry — ONLY real files in /static/characters */
  const personas = {
    wolfie: {
      avatar: `${base}/characters/Wolfie.png`,
      name: "Wolfie"
    },
    atlas: {
      avatar: `${base}/characters/Atlas.png`,
      name: "Atlas"
    },
    system: {
      avatar: "",
      name: ""
    },
    user: {
      avatar: "",
      name: ""
    }
  };

  /* Fallbacks for safety */
  function resolveAvatar(role) {
    return personas[role]?.avatar || `${base}/characters/Wolfie.png`;
  }

  function resolveName(role) {
    return personas[role]?.name || "";
  }

  /* Auto-scroll */
  function scrollToBottom() {
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }

  onMount(scrollToBottom);
  afterUpdate(scrollToBottom);
</script>

<div class="chat-shell" bind:this={container}>
  {#each messages as m}
    <Message
      sender={m.role}
      text={m.text}
      avatar={resolveAvatar(m.role)}
      name={resolveName(m.role)}
    />
  {/each}
</div>

<style>
  .chat-shell {
    width: 100%;
    max-width: 38rem;
    margin: 0 auto;

    padding: 1rem 1rem 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;

    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    overscroll-behavior: contain;
  }

  .chat-shell::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 420px) {
    .chat-shell {
      padding: 0.85rem 0.85rem 1.25rem 0.85rem;
      gap: 0.8rem;
    }
  }
</style>
