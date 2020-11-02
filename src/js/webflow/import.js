exports.transform = function (window, $) {
  $("head").append('<meta name="theme-color" content="#0094ff">');
  $("head").append('<link rel="manifest" href="manifest.webmanifest">');
  $("head").append("<script>dataLayer = [];</script>");

  // Adding a script tag to body via jQuery seems to add it to head as well
  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  window.document.body.appendChild(tag);
};
