import { sendServiceWorkerMessage } from "../swRegistration";

function getOfflineBanner() {
  const bannerStyle = {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: "6px",
    display: "none",
    fontWeight: "bold",
    margin: "0 auto 24px",
    maxWidth: "80%",
    padding: "12px 24px",
  };
  return $("<div />", {
    text: "You are currently offline. Some app functionality might not work.",
    class: "offline-status-banner",
  }).css(bannerStyle);
}

export function showConnectionStatus() {
  let $offlineStatusBanner = null;
  let isOnline = "onLine" in navigator ? navigator.onLine : true;
  $(".nav").after(getOfflineBanner());

  if (!isOnline) {
    $offlineStatusBanner = $(".offline-status-banner");
    $offlineStatusBanner.show();
    isOnline = false;
  }

  window.addEventListener("online", () => {
    $offlineStatusBanner = $offlineStatusBanner || $(".offline-status-banner");
    $offlineStatusBanner.hide();
    isOnline = true;
    sendServiceWorkerMessage({
      type: "ONLINE_STATUS_UPDATE",
      payload: { isOnline },
    });
  });

  window.addEventListener("offline", () => {
    $offlineStatusBanner = $offlineStatusBanner || $(".offline-status-banner");
    $offlineStatusBanner.show();
    isOnline = false;
    sendServiceWorkerMessage({
      type: "ONLINE_STATUS_UPDATE",
      payload: { isOnline },
    });
  });
}
