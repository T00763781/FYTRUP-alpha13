<!-- ------------------------------------------------------------
     CHATWRAPPER.SVELTE — FYTRUP Alpha12 (FooterTray Architecture)
------------------------------------------------------------- -->

<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import ChatShell from "./ChatShell.svelte";
  import { chatState } from "$lib/state/chatState.js";

  const dispatch = createEventDispatcher();

  export let sheetPos = 0.85;  // 0 = full, 0.55 = half, 0.85 = peek
  export let showCamera = false;

  // Allowed snap values
  const SNAP = [0, 0.55, 0.85];

  let messages = [];
  const unsub = chatState.subscribe(v => (messages = v));

  // ------------------------------------------------------------
  // Fix: Clamp incoming sheetPos to prevent drawer covering tray
  // ------------------------------------------------------------
  $: {
    if (sheetPos < 0.02) sheetPos = 0.02;  // prevents full overlap
    if (sheetPos > 0.92) sheetPos = 0.92;  // prevents drawer drifting
  }

  function cycleSheet() {
    let i = SNAP.findIndex(v => Math.abs(v - sheetPos) < 0.05);
    if (i === -1) i = 0;

    let next = SNAP[(i + 1) % SNAP.length];

    // clamp outgoing value too
    if (next < 0.02) next = 0.02;

    sheetPos = next;
    dispatch("sheetChange", sheetPos);
  }

  onDestroy(unsub);
</script>

<style>
  .sheet {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    background: var(--bg);
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
  }

  .handle {
    width: 54px;
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.45);

    margin: 10px auto 14px auto;
    cursor: pointer;
  }

  .messages {
    flex: 1 1 auto;
    overflow-y: auto;
    padding-bottom: 1rem;
    scrollbar-width: none;
  }

  .messages::-webkit-scrollbar {
    display: none;
  }
</style>

<div class="sheet">
  <div class="handle" on:click={cycleSheet}></div>

  <div class="messages">
    <ChatShell {messages} />
  </div>
</div>
