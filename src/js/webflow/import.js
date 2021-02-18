exports.transformHTML = function (html) {
  newHtml = html.replace(/"index.html"/g, '"/"');
  return newHtml;
};

exports.transform = function (window, $) {
  // Prevent search engine indexing if not production site
  if (process.env.ENVIRONMENT !== 'production') {
    $("head").append('<meta name="robots" content="noindex">');
  }

  $("head").append('<meta name="theme-color" content="#0094ff">');
  $("head").append('<link rel="manifest" href="manifest.webmanifest">');
  $("head").append("<script>dataLayer = [];</script>");
  $("head").append(`
    <script>
      const pushpadProjectId = \`${process.env.PUSHPAD_PROJECT_ID}\`;
      if (pushpadProjectId !== '' && pushpadProjectId !== 'undefined') {
        (function (p, u, s, h, x) { p.pushpad = p.pushpad || function () { (p.pushpad.q = p.pushpad.q || []).push(arguments) }; h = u.getElementsByTagName('head')[0]; x = u.createElement('script'); x.async = 1; x.src = s; h.appendChild(x); })(window, document, 'https://pushpad.xyz/pushpad.js');
        pushpad('init', pushpadProjectId, {serviceWorkerPath: null});
        pushpad('widget', {
          promptTitle: 'Subscribe to Notifications',
          promptMessage: 'Subscribe to receive instant notifications of service disruptions and other important information.',
          promptButtonColor: "#0094ff",
        });
      } else {
        console.warn('Pushpad project ID not set; not initialising');
      }
    </script>
  `);

  // Adding a script tag to body via jQuery seems to add it to head as well
  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  window.document.body.appendChild(tag);

};
