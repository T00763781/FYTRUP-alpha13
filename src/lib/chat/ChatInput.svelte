<!-- ------------------------------------------------------------
   CHATINPUT.SVELTE — Alpha12
   • Global fixed input bar
   • Camera toggle + Send button
   • Fully GitHub Pages safe via `base`
------------------------------------------------------------- -->

<script>
  import { createEventDispatcher } from "svelte";
  import { base } from "$app/paths";

  export let showCamera = false;

  const dispatch = createEventDispatcher();
  let message = "";

  function handleSend() {
    const txt = message.trim();
    if (!txt) return;
    dispatch("send", txt);
    message = "";
  }

  function toggleCamera() {
    dispatch("toggleCamera");
  }

  // CASE-SAFE ICONS (must match /static/icons exactly)
  const camOff  = `${base}/icons/Camera.png`;
  const camOn   = `${base}/icons/Camera_selected.png`;
  const sendBtn = `${base}/icons/send-icon.png`;
</script>

<style>
  .input-bar-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    z-index: 50;
    padding: 10px 0 calc(env(safe-area-inset-bottom) + 6px) 0;

    display: flex;
    justify-content: center;
    background: transparent;
  }

  .input-bar {
    width: 92%;
    max-width: 38rem;

    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 1.75rem;

    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    padding: 0.6rem 0.75rem;

    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  button {
    background: none;
    border: none;
    width: 2rem;
    height: 2rem;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
  }

  button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;

    font-size: 1rem;
    color: var(--text-primary);
    padding: 0.15rem 0;
  }

  @media (max-width: 420px) {
    .input-bar {
      width: 94%;
      padding: 0.75rem 0.9rem;
    }
    input {
      font-size: 1.05rem;
    }
  }
</style>

<div class="input-bar-wrap">
  <div class="input-bar">

    <!-- Camera toggle -->
    <button on:click={toggleCamera} aria-label="Toggle camera">
      <img src={showCamera ? camOn : camOff} alt="camera toggle" />
    </button>

    <!-- Text entry -->
    <input
      bind:value={message}
      placeholder="Chat with the Pack…"
      on:keydown={(e) => e.key === "Enter" && handleSend()}
    />

    <!-- Send -->
    <button on:click={handleSend} aria-label="Send message">
      <img src={sendBtn} alt="send" />
    </button>

  </div>
</div>
