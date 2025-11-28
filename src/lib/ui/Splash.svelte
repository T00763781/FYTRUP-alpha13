<script>
  import { onMount } from "svelte";
  import { base } from "$app/paths";

  export let show = true;

  // Internal state so we don’t mutate the prop directly
  let visible = show;

  const ALL_LINES = [
    "Picking up Wolfie’s poop…",
    "Sharpening Voxel’s blueprints…",
    "Untangling Echo’s headphones…",
    "Debugging Pixel’s compiler…",
    "Side-hustling acorn futures with Ledger…",
    "Gathering Stacks’ textbooks…",
    "Recharging Pulse’s smartwatch…",
    "Sorting Ember’s campfire gear…",
    "Refolding Summit’s topo maps…",
    "Deleting Goggle’s blurry photos…",
    "Tuning Torque’s wrench set…",
    "Testing Nimbus’s weather sensors…",
    "Reshelving Clip’s binders…",
    "Touching up Chalk’s markings…",
    "Rebooting Byte’s systems…",
    "Organizing Brief’s documents…",
    "Steadying Atlas’s compass…",
    "Prepping Rally’s team meeting…"
  ];

  function pickFiveUnique() {
    const shuffled = [...ALL_LINES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }

  let selected = pickFiveUnique();
  let index = 0;
  let line = selected[0];

  onMount(() => {
    const interval = setInterval(() => {
      index++;
      if (index < selected.length) {
        line = selected[index];
      }
    }, 1000);

    const timeout = setTimeout(() => {
      visible = false;
      clearInterval(interval);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  });
</script>

<style>
  :root {
    --tru-blue: #003e51;
    --bg-dark: #001d28;
    --tru-teal: #00b0b9;
    --tru-yellow: #ffcd00;
    --ol-green: #00b18f;
    --tru-orange: #f88f23;
  }

  .splash {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: radial-gradient(circle at center, var(--tru-blue) 0%, var(--bg-dark) 100%);
    gap: 1.2rem;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    height: 100vh;
    width: 100%;
    z-index: 9999;
    transition: opacity 0.7s ease;
  }

  .hidden {
    opacity: 0;
    pointer-events: none;
  }

  .title {
    font-size: 2.4rem;
    font-weight: 700;
    display: flex;
    gap: 0.35rem;
    text-align: center;
    line-height: 1.1;
  }

  .sub {
    opacity: 0.9;
    font-size: 1.05rem;
    text-align: center;
  }

  .t-find  { color: var(--tru-teal); }
  .t-your  { color: var(--tru-yellow); }
  .t-tru   { color: var(--ol-green); }
  .t-path  { color: var(--tru-orange); }

  .bar {
    width: 70%;
    max-width: 320px;
    height: 6px;
    background: rgba(255,255,255,0.25);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.6rem;
  }

  .fill {
    height: 100%;
    width: 0%;
    background: white;
    animation: load 5s linear forwards;
  }

  @keyframes load {
    from { width: 0%; }
    to   { width: 100%; }
  }

  @media (max-width: 420px) {
    .title { font-size: 1.9rem; }
    .sub   { font-size: 0.95rem; }
    .bar   { height: 5px; width: 75%; }
  }
</style>

<div class="splash {visible ? '' : 'hidden'}">
  <div class="title">
    <span class="t-find">Find</span>
    <span class="t-your">Your</span>
    <span class="t-tru">TRU</span>
    <span class="t-path">Path</span>
  </div>

  <div class="sub">{line}</div>

  <div class="bar">
    <div class="fill"></div>
  </div>
</div>
