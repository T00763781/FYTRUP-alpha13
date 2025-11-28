<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { browser } from "$app/environment";
  import { decodeFrame } from "$lib/qr/decoder.js";

  const dispatch = createEventDispatcher();

  let videoEl;
  let containerEl;

  let stream = null;
  let rafId = null;
  let resizeObs = null;

  // intelligent object-fit state
  let objectFit = "contain";
  let objectPosition = "center center";

  // scanning guard
  let lastPayload = null;
  let lastTime = 0;

  function updateFitMode() {
    if (!videoEl || !containerEl) return;

    const vw = videoEl.videoWidth;
    const vh = videoEl.videoHeight;
    if (!vw || !vh) return;

    const cw = containerEl.clientWidth;
    const ch = containerEl.clientHeight;
    if (!cw || !ch) return;

    const videoAR = vw / vh;
    const containerAR = cw / ch;

    if (videoAR > containerAR) {
      objectFit = "contain";
    } else {
      objectFit = "cover";
    }
  }

  onMount(async () => {
    if (!browser) return;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      videoEl.srcObject = stream;
      await videoEl.play();

      videoEl.onloadedmetadata = () => updateFitMode();

      resizeObs = new ResizeObserver(() => updateFitMode());
      resizeObs.observe(containerEl);

      scanLoop();
    } catch (err) {
      console.error("Camera error:", err);
    }
  });

  onDestroy(() => {
    if (rafId) cancelAnimationFrame(rafId);

    if (resizeObs) {
      resizeObs.disconnect();
      resizeObs = null;
    }

    if (stream) {
      for (const t of stream.getTracks()) t.stop();
      stream = null;
    }
  });

  function scanLoop() {
    rafId = requestAnimationFrame(scanLoop);
    if (!videoEl) return;

    const txt = decodeFrame(videoEl);
    if (!txt) return;

    const now = performance.now();
    if (txt === lastPayload && now - lastTime < 2000) return;

    lastPayload = txt;
    lastTime = now;

    dispatch("qrResult", txt);
  }
</script>

<style>
  .camera-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
  }

  video {
    width: 100%;
    height: 100%;
    display: block;
    background: #000;
  }
</style>

<div class="camera-container" bind:this={containerEl}>
  <video
    bind:this={videoEl}
    playsinline
    autoplay
    style="
      object-fit: {objectFit};
      object-position: {objectPosition};
    "
  ></video>
</div>
