function getPath() {
  return window.location.href;
}

function getWhatsappShareURL() {
  const encodedShareMessage = encodeURI(
    `I'd like to share this Citizen Engagement page with you: ${getPath()}`
  );
  return `https://wa.me/?text=${encodedShareMessage}`;
}

function getFacebookShareURL() {
  return `https://www.facebook.com/sharer/sharer.php?u=${getPath()}`;
}

function getTwitterShareURL() {
  const encodedShareMessage = encodeURI(`Have you seen this? ${getPath()}`);
  return `https://twitter.com/intent/tweet?text=${encodedShareMessage}`;
}

function getLinkedinShareURL() {
  return `https://www.linkedin.com/shareArticle?mini=true&url=${getPath()}`;
}

function getEmailShareURL() {
  const encodedSubject = encodeURI("Take a look at the Cape Agulhas App");
  const encodedBody = encodeURI(`Take a look at this page in the Cape Agulhas App: ${getPath()}`);
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
}

function copyTextToClipboard() {
  navigator.clipboard.writeText(getPath()).then(
    function () {},
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
}

export function setShareMenuLinks() {
  const $shareCopyLink = $(".share__link.copy-link");
  const $shareEmail = $(".share__link.email")[0];
  const $shareLinkedin = $(".share__link.linkedin")[0];
  const $shareWhatsapp = $(".share__link.whatsapp")[0];
  const $shareFacebook = $(".share__link.facebook")[0];
  const $shareTwitter = $(".share__link.twitter")[0];

  $shareCopyLink.click(copyTextToClipboard);

  $shareWhatsapp.setAttribute("href", getWhatsappShareURL());
  $shareWhatsapp.setAttribute("target", "_blank");

  $shareFacebook.setAttribute("href", getFacebookShareURL());
  $shareFacebook.setAttribute("target", "_blank");

  $shareTwitter.setAttribute("href", getTwitterShareURL());
  $shareTwitter.setAttribute("target", "_blank");

  $shareLinkedin.setAttribute("href", getLinkedinShareURL());
  $shareLinkedin.setAttribute("target", "_blank");

  $shareEmail.setAttribute("href", getEmailShareURL());
  $shareEmail.setAttribute("target", "_blank");
}

export function showShareMenu() {
  setShareMenuLinks()
  const $shareButton = $(".share");
  $shareButton.show();
}

export function hideShareMenu() {
  const $shareButton = $(".share");
  $shareButton.hide();
}
