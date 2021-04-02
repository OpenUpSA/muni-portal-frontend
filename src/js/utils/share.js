export function shareToWhatsapp() {
  const currentPath = window.location.href;
  const encodedShareMessage = encodeURI(
    `I'd like to share this Citizen Engagement page with you: ${currentPath}`
  );

  const shareUrl = `https://wa.me/?text=${encodedShareMessage}`;
  window.open(shareUrl);
}

export function shareToFacebook() {
  const currentPath = window.location.href;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentPath}`;
  window.open(shareUrl, "pop", "width=600, height=400, scrollbars=no");
}
