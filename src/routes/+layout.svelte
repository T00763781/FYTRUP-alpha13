<!-- ------------------------------------------------------------
     +LAYOUT.SVELTE — FYTRUP Alpha12 (Stable Global Shell)
     Root UI: Splash, Header, Map, Camera, Chat, FooterTray, Drawer
------------------------------------------------------------- -->

<svelte:head>
  <meta
    name="viewport"
    content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
  />
  <script>
    (function () {
      const theme = localStorage.getItem("fytrup-theme") || "tru";
      document.documentElement.setAttribute("data-theme", theme);
    })();
  </script>

  <link rel="icon" type="image/png" href="{base}/favicon_512x512.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="{base}/favicon_32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="{base}/favicon_16x16.png" />
  <link rel="icon" type="image/x-icon" href="{base}/favicon.ico" />
  <link rel="manifest" href="{base}/manifest.json">
</svelte:head>


<script>
  import { onMount, onDestroy } from "svelte";
  import { base } from "$app/paths";

  import "$lib/theme/themes.css";
  import { initTheme } from "$lib/theme/store.js";

  import Splash from "$lib/ui/Splash.svelte";
  import Header from "$lib/ui/Header.svelte";

  import ChatWrapper from "$lib/chat/ChatWrapper.svelte";
  import FooterTray from "$lib/ui/FooterTray.svelte";

  import MapView from "$lib/map/MapView.svelte";
  import CameraView from "$lib/camera/CameraView.svelte";

  import ContactsDrawer from "$lib/ui/ContactsDrawer.svelte";
  import ContactHeroOverlay from "$lib/ui/ContactHeroOverlay.svelte";

  import { appState, noteEvent } from "$lib/state/appState.js";
  import { classifyNote } from "$lib/qr/classifier.js";
  import { chatState } from "$lib/state/chatState.js";

  let showSplash = true;
  let state = {};
  let unsubscribe;

  let contactsOpen = false;
  let sheetPos = 0.85;

  function handleSheetChange(e) {
    sheetPos = e.detail;
  }

  function handleToggleContacts() {
    contactsOpen = !contactsOpen;
  }

  onMount(() => {
    initTheme();
    unsubscribe = appState.subscribe(v => (state = v));

    const base = 16, min = 15, max = 19;
    const scaled = Math.min(max, Math.max(min, (window.innerWidth / 375) * base));
    document.documentElement.style.fontSize = scaled + "px";

    const hideBars = () => window.scrollTo({ top: 1, behavior: "auto" });

    setTimeout(() => {
      showSplash = false;
      setTimeout(() => {
        hideBars();
        setTimeout(hideBars, 50);
        setTimeout(hideBars, 250);
      }, 100);
    }, 2200);
  });

  onDestroy(() => unsubscribe && unsubscribe());

  function handleToggleCamera() {
    appState.update(s => ({ ...s, showCamera: !s.showCamera }));
  }

  function handleQR(e) {
    const outcome = classifyNote(e.detail);
    noteEvent(outcome);
    appState.update(s => ({ ...s, showCamera: false }));
  }

  function handleSend(e) {
    const text = e.detail;
    if (!text) return;
    chatState.sendUserMessage(text);
  }
</script>

<style>
  :root {
    --tray-height: 80px;
  }

  html, body {
    touch-action: pan-y;
    overscroll-behavior: none;
    background: var(--bg);
    margin: 0;
    padding: 0;
  }

  .app-root {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: var(--bg);
    color: var(--text);
    padding-top: env(safe-area-inset-top);
  }

  .layer-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 30;
  }

  .layer-map {
    position: absolute;
    top: calc(3.4rem + env(safe-area-inset-top));
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    overflow: hidden;
    transition: opacity .25s ease;
  }

  .dimmed { opacity: .25; }

  .layer-camera {
    position: absolute;
    inset: 0;
    z-index: 15;
    opacity: 0;
    pointer-events: none;
    background: black;
    transition: opacity .25s ease;
  }

  .showcam {
    opacity: 1;
    pointer-events: auto;
  }

  .layer-chat {
    position: absolute;
    left: 0;
    right: 0;

    top: calc(3.4rem + env(safe-area-inset-top));
    bottom: var(--tray-height);
    z-index: 25;

    background: var(--bg);
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    box-shadow: 0 -3px 10px rgba(0,0,0,0.30);

    overflow: hidden;
    transform: translateY(calc(var(--sheet-offset) * 1%));
    transition: transform .25s ease;
  }

  /* Left sliding contacts list */
  .contacts-layer {
    position: absolute;
    top: calc(3.4rem + env(safe-area-inset-top));
    bottom: var(--tray-height);
    left: 0;

    width: 100%;
    max-width: 500px;

    background: rgba(0,50,60,0.96);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    box-shadow: 6px 0 18px rgba(0,0,0,0.35);
    border-right: 1px solid rgba(255,255,255,0.06);

    z-index: 40;

    transform: translateX(-100%);
    transition: transform .25s ease;
  }

  .contacts-layer.open {
    transform: translateX(0%);
  }

  .layer-splash {
    position: absolute;
    inset: 0;
    z-index: 200;
  }

  .fade { transition: opacity .6s ease; }
  .hidden-splash { opacity: 0; pointer-events: none; }
</style>


<div class="app-root">

  <div class="layer-header">
    <Header on:toggleContacts={handleToggleContacts} />
  </div>

  <div class="layer-map {state.showCamera ? 'dimmed' : ''}">
    <MapView />
  </div>

  <div class="layer-camera {state.showCamera ? 'showcam' : ''}">
    <CameraView on:qrResult={handleQR} />
  </div>

  <div class="layer-chat" style="--sheet-offset:{sheetPos * 100}">
    <ChatWrapper
      {sheetPos}
      on:sheetChange={handleSheetChange}
      showCamera={state.showCamera}
      on:toggleCamera={handleToggleCamera}
    />
  </div>

  <!-- Rolodex Contacts Drawer -->
  <div class="contacts-layer {contactsOpen ? 'open' : ''}">
    <ContactsDrawer />
  </div>

  <!-- Fullscreen Hero Overlay -->
  {#if state.activeContact}
    <ContactHeroOverlay
      mate={state.activeContact}
      on:close={() => appState.update(s => ({ ...s, activeContact: null }))}
    />
  {/if}

  {#if !showSplash}
    <FooterTray
      showCamera={state.showCamera}
      on:send={handleSend}
      on:toggleCamera={handleToggleCamera}
    />
  {/if}

  <slot />

  <div class="layer-splash fade {showSplash ? '' : 'hidden-splash'}">
    <Splash />
  </div>
</div>
