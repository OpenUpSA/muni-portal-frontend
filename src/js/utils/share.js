function getPath() {
  return window.location.href;
}

export function getWhatsappShareURL() {
  const encodedShareMessage = encodeURI(
    `I'd like to share this Citizen Engagement page with you: ${getPath()}`
  );
  return `https://wa.me/?text=${encodedShareMessage}`;
}

export function getFacebookShareURL() {
  return `https://www.facebook.com/sharer/sharer.php?u=${getPath()}`;
}

export function getTwitterShareURL() {
  const encodedShareMessage = encodeURI(`Have you seen this? ${getPath()}`);
  return `https://twitter.com/intent/tweet?text=${encodedShareMessage}`;
}

export function getLinkedinShareURL() {
  return `https://www.linkedin.com/shareArticle?mini=true&url=${getPath()}`;
}

export function getEmailShareURL() {
  const encodedSubject = encodeURI("Have you seen this page?");
  const encodedBody = encodeURI(`Have a look here: ${getPath()}`);
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
}

export function copyTextToClipboard() {
  navigator.clipboard.writeText(getPath()).then(
    function () {},
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
}
