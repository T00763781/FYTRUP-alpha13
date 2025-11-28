<!-- ------------------------------------------------------------
     HEADER.SVELTE — TRU Brand Header + Contacts Button (LEFT)
     • GH Pages base-safe
     • Clean icon rendering
     • Patched: pointer-events layering + z-index hardening
------------------------------------------------------------- -->

<script>
  import { createEventDispatcher } from "svelte";
  import { cycleTheme } from "$lib/theme/store.js";
  import { base } from "$app/paths";

  const dispatch = createEventDispatcher();
  const contactsIcon = `${base}/icons/contacts.png`;

  function openContacts() {
    dispatch("toggleContacts");
  }
</script>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    height: calc(3.4rem + env(safe-area-inset-top));
    padding-top: env(safe-area-inset-top);

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--header-bg);
    color: var(--header-text);
    font-weight: 700;

    user-select: none;

    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    z-index: 50;
  }

  .inner {
    width: 100%;
    max-width: 44rem;
    padding: 0 0.75rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Absolute-centered title container
     Now pointer-events:none to prevent blocking left icon */
  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;

    pointer-events: none;
  }

  /* Click target re-enabled here */
  .title-hit {
    display: flex;
    gap: 0.35rem;
    font-size: 1.55rem;
    line-height: 1;

    cursor: pointer;
    pointer-events: auto;
  }

  .t-find  { color: var(--accent-teal); }
  .t-your  { color: var(--accent-yellow); }
  .t-tru   { color: var(--accent-green); }
  .t-path  { color: var(--accent-orange); }

  .contacts-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    cursor: pointer;
    transition: background 0.15s ease;
    z-index: 20; /* <-- PATCH: ensure button stays above centered text */

    overflow: hidden;
  }

  .contacts-btn:hover {
    background: rgba(255,255,255,0.20);
  }

  .contacts-btn img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;

    display: block;
    padding: 0;
    margin: 0;
    opacity: 1;
    filter: none;
  }

  @media (max-width: 420px) {
    .title-hit {
      font-size: 1.7rem;
    }
    .contacts-btn {
      width: 36px;
      height: 36px;
    }
  }
</style>

<div class="header">
  <div class="inner">

    <!-- LEFT CONTACTS BUTTON -->
    <div class="contacts-btn" on:click={openContacts}>
      <img src={contactsIcon} alt="Contacts" />
    </div>

    <!-- TRUE-CENTERED TITLE -->
    <div class="title">
      <div class="title-hit" on:click={cycleTheme}>
        <span class="t-find">Find</span>
        <span class="t-your">Your</span>
        <span class="t-tru">TRU</span>
        <span class="t-path">Path</span>
      </div>
    </div>

    <div style="width:34px;"></div>

  </div>
</div>
