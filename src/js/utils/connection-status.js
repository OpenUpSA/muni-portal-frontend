import { sendServiceWorkerMessage } from "../swRegistration";

export function getStatusBanner(msg) {
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
    text: msg,
    class: "offline-status-banner",
  }).css(bannerStyle);
}

export function showConnectionStatus() {
  let $statusBanner = null;
  let isOnline = "onLine" in navigator ? navigator.onLine : true;

  if (!isOnline) {
    $(".nav").after(
      getStatusBanner(
        "You are currently offline. Some app functionality might not work."
      )
    );
    $statusBanner = $(".offline-status-banner");
    $statusBanner.show();
    isOnline = false;
  }

  window.addEventListener("online", () => {
    $statusBanner = $statusBanner || $(".offline-status-banner");
    $statusBanner.hide();
    isOnline = true;
    sendServiceWorkerMessage({
      type: "ONLINE_STATUS_UPDATE",
      payload: { isOnline },
    });
  });

  window.addEventListener("offline", () => {
    $statusBanner = $statusBanner || $(".offline-status-banner");
    $statusBanner.show();
    isOnline = false;
    sendServiceWorkerMessage({
      type: "ONLINE_STATUS_UPDATE",
      payload: { isOnline },
    });
  });
}
