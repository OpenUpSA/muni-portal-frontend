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
  const encodedPath = encodeURI(currentPath)
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedPath}`;
  window.open(shareUrl, "pop", "width=600, height=400, scrollbars=no");
}

export function shareToTwitter() {
  const currentPath = window.location.href;
  const encodedShareMessage = encodeURI(
    `Have you seen this? ${currentPath}`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodedShareMessage}`
  window.open(shareUrl)
}
