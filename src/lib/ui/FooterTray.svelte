<!-- ------------------------------------------------------------
     FOOTERTRAY.SVELTE — FYTRUP Alpha12 (Stable Build)
------------------------------------------------------------- -->

<script>
  import { createEventDispatcher } from "svelte";
  import ChatInput from "$lib/chat/ChatInput.svelte";

  export let showCamera = false;

  const dispatch = createEventDispatcher();

  function handleSend(e) {
    dispatch("send", e.detail);
  }

  function handleToggleCamera() {
    dispatch("toggleCamera");
  }
</script>

<style>
  :global(:root) {
    --tray-height: 80px;
  }

  .tray-root {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    height: var(--tray-height);
    padding-bottom: env(safe-area-inset-bottom);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 50;

    background: linear-gradient(
      rgba(0, 70, 90, 0.12),
      rgba(0, 70, 90, 0.25)
    );

    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.25);
  }

  .inner {
    width: 100%;
    max-width: 40rem;
    padding: 0 0.75rem;
  }
</style>

<div class="tray-root">
  <div class="inner">
    <ChatInput
      {showCamera}
      on:send={handleSend}
      on:toggleCamera={handleToggleCamera}
    />
  </div>
</div>
