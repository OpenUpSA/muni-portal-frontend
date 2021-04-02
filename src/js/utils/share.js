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
  window.open(shareUrl );
}

export function shareToTwitter() {
  const currentPath = window.location.href;
  const encodedShareMessage = encodeURI(`Have you seen this? ${currentPath}`);
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodedShareMessage}`;
  window.open(shareUrl);
}

export function shareToLinkedin() {
  const currentPath = window.location.href;
  const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentPath}`;
  window.open(shareUrl);
}
