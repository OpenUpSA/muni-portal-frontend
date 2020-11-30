exports.transform = function (window, $) {
  $("head").append('<meta name="theme-color" content="#0094ff">');
  $("head").append('<link rel="manifest" href="manifest.webmanifest">');
  $("head").append("<script>dataLayer = [];</script>");

  addScriptToBody(window, {
    src: "https://browser.sentry-cdn.com/5.27.6/bundle.tracing.min.js",
    integrity: "sha384-9Z8PxByVWP+gIm/rTMPn9BWwknuJR5oJcLj+Nr9mvzk8nJVkVXgQvlLGZ9SIFEJF",
    crossorigin: "anonymous",
  });
  addScriptToBody(window, {}, '\
  Sentry.init({\
  dsn: "{{ SENTRY_DSN }}",\
  integrations: [new Sentry.Integrations.BrowserTracing()],\
  tracesSampleRate: 0.1,\
})');

  addScriptToBody(window, {src: "js/index.js"});
};

function addScriptToBody(window, attrs, text) {
  // Adding a script tag to body via jQuery seems to add it to head as well
  const tag = window.document.createElement("script");
  for (let name in attrs)
    tag.setAttribute(name, attrs[name]);
  if (text)
    tag.appendChild(window.document.createTextNode(text));

  window.document.body.appendChild(tag);
  window.document.body.appendChild(window.document.createTextNode("\n"));
}
