<!-- ------------------------------------------------------------
     COMPONENT: Message.svelte — FYTRUP Alpha12 (Tray-Safe Version)
     PURPOSE:
       • Persona or user messages
       • System banners
       • Never overflow horizontally
       • Stable spacing with FooterTray
------------------------------------------------------------- -->

<script>
  export let sender = "system";
  export let avatar = "";
  export let name = "";
  export let text = "";
</script>

<style>
  :root {
    --bubble-bg: rgba(255,255,255,0.14);
    --bubble-bg-user: rgba(0,62,81,0.26);
    --bubble-border: rgba(255,255,255,0.22);
    --bubble-border-user: rgba(0,62,81,0.36);

    --glass-blur: blur(16px);
    --tru-teal: #00b0b9;
  }

  /* ------------------------------------------------------------
       SYSTEM BANNER (centered)
  ------------------------------------------------------------ */
  .system-banner {
    width: 100%;
    text-align: center;

    font-size: 0.85rem;
    line-height: 1.35;
    color: var(--tru-teal);
    opacity: 0.9;
    font-weight: 600;

    margin: 0.5rem 0;
    letter-spacing: 0.015em;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .system-banner::before,
  .system-banner::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(255,255,255,0.25);
    opacity: 0.35;
    margin: 0 0.5rem;
  }

  /* ------------------------------------------------------------
       ROW: persona or user bubble line
  ------------------------------------------------------------ */
  .row {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    margin: 0.15rem 0;

    overflow: hidden;         /* lock horizontal jitter */
  }

  .me {
    justify-content: flex-end;
  }

  /* ------------------------------------------------------------
       AVATAR COLUMN
  ------------------------------------------------------------ */
  .avatar-col {
    width: 2.4rem;
    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.1rem;

    overflow: hidden;         /* prevent tiny shift on long names */
  }

  .avatar {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 0.25rem rgba(0,0,0,0.25);
  }

  .name {
    margin-top: 0.2rem;
    font-size: 0.72rem;
    line-height: 1.1;
    opacity: 0.78;
    color: var(--text);
    text-align: center;

    white-space: nowrap;
    max-width: 3rem;
    overflow: hidden;
  }

  @media (max-width: 420px) {
    .avatar {
      width: 1.6rem;
      height: 1.6rem;
    }
    .name {
      font-size: 0.68rem;
    }
  }

  /* ------------------------------------------------------------
       BUBBLE
  ------------------------------------------------------------ */
  .bubble {
    max-width: 75%;
    padding: 0.8rem 1rem;

    background: var(--bubble-bg);
    border: 1px solid var(--bubble-border);
    border-radius: 0.9rem;

    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);

    color: white;
    font-size: 0.98rem;
    line-height: 1.45;

    word-break: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;

    overflow-x: hidden;   /* HARD lock to stop any jitter */
  }

  .me .bubble {
    background: var(--bubble-bg-user);
    border-color: var(--bubble-border-user);
  }

  @media (max-width: 420px) {
    .bubble {
      font-size: 1.03rem;
      padding: 0.85rem 1.05rem;
      max-width: 78%;
    }
  }
</style>


<!-- ------------------------------------------------------------
     RENDER
------------------------------------------------------------ -->

{#if sender === "system"}
  <div class="system-banner">{text}</div>

{:else}
  <div class="row {sender === 'user' ? 'me' : ''}">

    {#if sender !== "user" && avatar}
      <div class="avatar-col">
        <img class="avatar" src={avatar} alt={sender} />
        {#if name}
          <div class="name">{name}</div>
        {/if}
      </div>
    {/if}

    <div class="bubble">
      {text}
    </div>
  </div>
{/if}
