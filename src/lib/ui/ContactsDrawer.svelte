<script>
  import { contactsState } from "$lib/state/contactsState.js";
  import { fade, slide } from "svelte/transition";
  import { onDestroy } from "svelte";
  import { base } from "$app/paths";

  let unlocked = {};
  const unsub = contactsState.subscribe(v => (unlocked = v));

  const img = (p) => `${base}${p}`;

  /* ------------------------------------------------------------
     PACKMATES — Base-safe image paths
  ------------------------------------------------------------ */
  const PACKMATES = [
    { id:"wolfie",  name:"Wolfie",  avatar:img("/characters/Wolfie.png"),  full:img("/characters/Wolfie(full).png") },
    { id:"voxel",   name:"Voxel",   avatar:img("/characters/Voxel.png"),   full:img("/characters/Voxel(full).png") },
    { id:"torque",  name:"Torque",  avatar:img("/characters/Torque.png"),  full:img("/characters/Torque(full).png") },
    { id:"summit",  name:"Summit",  avatar:img("/characters/Summit.png"),  full:img("/characters/Summit(full).png") },
    { id:"stacks",  name:"Stacks",  avatar:img("/characters/Stacks.png"),  full:img("/characters/Stacks(full).png") },
    { id:"scope",   name:"Scope",   avatar:img("/characters/Scope.png"),   full:img("/characters/Scope(full).png") },
    { id:"rally",   name:"Rally",   avatar:img("/characters/Rally.png"),   full:img("/characters/Rally(full).png") },
    { id:"pulse",   name:"Pulse",   avatar:img("/characters/Pulse.png"),   full:img("/characters/Pulse(full).png") },
    { id:"pixel",   name:"Pixel",   avatar:img("/characters/Pixel.png"),   full:img("/characters/Pixel(full).png") },
    { id:"nimbus",  name:"Nimbus",  avatar:img("/characters/Nimbus.png"),  full:img("/characters/Nimbus(full).png") },
    { id:"ledger",  name:"Ledger",  avatar:img("/characters/Ledger.png"),  full:img("/characters/Ledger(full).png") },
    { id:"goggle",  name:"Goggle",  avatar:img("/characters/Goggle.png"),  full:img("/characters/Goggle(full).png") },
    { id:"flex",    name:"Flex",    avatar:img("/characters/Flex.png"),    full:img("/characters/Flex(full).png") },
    { id:"ember",   name:"Ember",   avatar:img("/characters/Ember.png"),   full:img("/characters/Ember(full).png") },
    { id:"echo",    name:"Echo",    avatar:img("/characters/Echo.png"),    full:img("/characters/Echo(full).png") },
    { id:"clip",    name:"Clip",    avatar:img("/characters/Clip.png"),    full:img("/characters/Clip(full).png") },
    { id:"chalk",   name:"Chalk",   avatar:img("/characters/Chalk.png"),   full:img("/characters/Chalk(full).png") },
    { id:"byte",    name:"Byte",    avatar:img("/characters/Byte.png"),    full:img("/characters/Byte(full).png") },
    { id:"brief",   name:"Brief",   avatar:img("/characters/Brief.png"),   full:img("/characters/Brief(full).png") },
    { id:"atlas",   name:"Atlas",   avatar:img("/characters/Atlas.png"),   full:img("/characters/Atlas(full).png") }
  ];

  /* State */
  let activeMate = null;
  const openMate  = (m) => (activeMate = m);
  const closeMate = () => (activeMate = null);

  const getProgress = (id) => 0;
  const progressIcon  = (p) => img(`/icons/${p}-3.png`);
  const progressLabel = (p) => ["Added to your Pack","One note found","Two notes found","All notes found!"][p];

  $: unlockedList = PACKMATES.filter(p => unlocked[p.id]);
  $: lockedList   = PACKMATES.filter(p => !unlocked[p.id]);

  // reactive full-image path for detail drawer
  $: activeFull =
    activeMate ? (activeMate.full || activeMate.avatar) : "";

  onDestroy(() => unsub());
</script>

<style>
  .drawer-stack {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .drawer-main {
    position: absolute;
    inset: 0;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    background: var(--surface-1);
    color: var(--text-primary);
    backdrop-filter: blur(14px);
    border-radius: 18px 18px 0 0;

    overflow-y: auto;
    scrollbar-width: none;
  }
  .drawer-main::-webkit-scrollbar { display: none; }

  .drawer-main.peek {
    transform: translateY(-0.75rem) scale(.96);
    opacity: .85;
  }

  .section { display: flex; flex-direction: column; gap: .75rem; }
  h2 { margin: 0; font-size: 1.25rem; font-weight: 700; }

  .mate {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .5rem .25rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background .15s ease;
  }
  .mate:hover { background: rgba(255,255,255,.05); }

  .mate img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--surface-2);
  }

  .locked {
    opacity: .35;
    filter: grayscale(40%);
    pointer-events: none;
  }

  .drawer-detail {
    position: absolute;
    inset: 0;

    padding: 0.5em 0.2rem calc(1.4rem + 70px);
    background: var(--surface-2);
    backdrop-filter: blur(18px);
    border-radius: 18px 18px 0 0;

    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .detail-layout {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1.6rem;
    align-items: center;
    overflow: hidden;
  }

  .detail-art-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .detail-art {
    height: 100%;
    object-fit: contain;
    transform: translateX(-30%);
  }

  .detail-copy {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    gap: 1.4rem;
    padding-right: 1rem;
  }

  .detail-name-large { font-size: 2rem; font-weight: 700; }

  .detail-desc {
    font-size: 1rem;
    line-height: 1.4;
    max-width: 30rem;
  }

  .progress-block { display: flex; flex-direction: column; gap: .5rem; }
  .progress-bar   { width: 150px; }

  .bottom-back {
    position: absolute;
    top: 12px;
    right: 16px;

    width: 50px;
    height: 50px;

    background: var(--surface-2);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .bottom-back img {
    width: 26px;
    height: 26px;
  }
</style>

<div class="drawer-stack">

  <!-- CONTACT LIST -->
  <div class="drawer-main {activeMate ? 'peek' : ''}">
    <div class="section" transition:fade>
      <h2>Your Contacts</h2>
      {#each unlockedList as u}
        <div class="mate" on:click={() => openMate(u)}>
          <img src={u.avatar} alt={u.name}/>
          <div>{u.name}</div>
        </div>
      {/each}
    </div>

    <div class="section" transition:fade>
      <h2>Not Added Yet</h2>
      {#each lockedList as l}
        <div class="mate locked">
          <img src={l.avatar} alt={l.name}/>
          <div>{l.name}</div>
        </div>
      {/each}
    </div>
  </div>

  <!-- DETAIL VIEW -->
  {#if activeMate}
    <div class="drawer-detail" transition:slide={{ y: 40, duration: 180 }}>
      <div class="detail-layout">

        <div class="detail-art-wrap">
          <img class="detail-art" src={activeFull} alt={activeMate.name}/>
        </div>

        <div class="detail-copy">
          <div class="detail-name-large">{activeMate.name}</div>

          {#if activeMate.id === "wolfie"}
            <div class="detail-desc">
              Your first guide through campus, upbeat, always onboarding someone.
            </div>
          {:else}
            <div class="detail-desc">Packmate profile.</div>
          {/if}

          <div class="progress-block">
            <img class="progress-bar" src={progressIcon(getProgress(activeMate.id))}/>
            <div>{progressLabel(getProgress(activeMate.id))}</div>
          </div>

          <div>
            Explore the Future Students Office →
            <a href="https://www.tru.ca/future" target="_blank" rel="noreferrer">
              https://www.tru.ca/future
            </a>
          </div>
        </div>
      </div>

      <div class="bottom-back" on:click={closeMate}>
        <img src={img("/icons/back.png")} alt="Back"/>
      </div>
    </div>
  {/if}

</div>
