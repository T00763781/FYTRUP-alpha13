import { base } from "$app/paths";

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${base}/service-worker.js`)
      .then((reg) => console.log("Service worker registered:", reg))
      .catch((err) =>
        console.error("Service worker registration failed:", err)
      );
  });
}
