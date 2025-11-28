<script>
  import { createEventDispatcher } from "svelte";
  import { base } from "$app/paths";

  export let mate; // { id, name, full, avatar }

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }

  function description(id) {
    if (id === "wolfie") {
      return "Your first guide through campus, upbeat, always onboarding someone.";
    }
    return "Packmate profile.";
  }

  function progressIcon(p) {
    return `${base}/icons/${p}-3.png`;
  }

  function progressLabel(p) {
    if (p === 0) return "Added to your Pack";
    if (p === 1) return "One note found";
    if (p === 2) return "Two notes found";
    return "All notes found!";
  }

  // Reactive: always recompute when `mate` changes
  $: fullImg =
    mate
      ? `${base}${mate.full || mate.avatar}`
      : "";
</script>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;

    background: var(--surface-1);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);

    display: flex;
    flex-direction: row;

    padding: calc(env(safe-area-inset-top) + 1rem) 1rem
             calc(env(safe-area-inset-bottom) + 1rem) 1rem;

    overflow-y: auto;
  }

  .overlay-inner {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    gap: 2rem;
  }

  .art-wrap {
    flex: 0 0 40%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .art-wrap img {
    max-height: 80vh;
    width: auto;
    object-fit: contain;
  }

  .content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1.4rem;
    padding-top: 1rem;
  }

  .name {
    font-size: 2.6rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .desc {
    font-size: 1.15rem;
    line-height: 1.45;
    max-width: 32rem;
    opacity: 0.9;
  }

  .progress-block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .progress-bar {
    width: 160px;
  }

  .detail-link a {
    color: var(--accent);
    text-decoration: none;
    font-size: 1.15rem;
  }

  .detail-link a:hover {
    text-decoration: underline;
  }

  .close-btn {
    position: absolute;
    top: calc(env(safe-area-inset-top) + .5rem);
    right: 1rem;

    width: 50px;
    height: 50px;
    border-radius: 50%;

    background: var(--surface-2);
    box-shadow: 0 4px 18px rgba(0,0,0,0.25);

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    transition: transform .15s ease;
  }

  .close-btn:hover {
    transform: scale(1.06);
  }

  .close-btn img {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 600px) {
    .overlay-inner {
      flex-direction: column;
      gap: 1rem;
    }

    .art-wrap {
      flex: unset;
      width: 100%;
      justify-content: center;
    }

    .art-wrap img {
      max-height: 55vh;
    }

    .name {
      font-size: 2rem;
    }
  }
</style>

<div class="overlay">
  <div class="close-btn" on:click={close}>
    <img src={`${base}/icons/back.png`} alt="back" />
  </div>

  <div class="overlay-inner">
    <div class="art-wrap">
      <img src={fullImg} alt={mate.name} />
    </div>

    <div class="content">
      <div class="name">{mate.name}</div>

      <div class="desc">{description(mate.id)}</div>

      <div class="progress-block">
        <img class="progress-bar" src={progressIcon(0)} alt="progress" />
        <div class="progress-label">{progressLabel(0)}</div>
      </div>

      <div class="detail-link">
        <a href="https://www.tru.ca/future" target="_blank">
          Explore the Future Students Office →
        </a>
      </div>
    </div>
  </div>
</div>
