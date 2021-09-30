exports.transformHTML = function (html) {
  newHtml = html.replace(/"index.html"/g, '"/"');
  return newHtml;
};

exports.transform = function (window, $) {

  $("head").append('<meta name="theme-color" content="#0094ff">');
  $("head").append('<link rel="manifest" href="manifest.webmanifest">');
  $("head").append("<script>dataLayer = [];</script>");
  $("head").append(`
    <script>
      const pushpadProjectId = \`\${process.env.PUSHPAD_PROJECT_ID}\`;
      // Note that we're initialising inside a template literal, so if the env var isn't set, it is a string 'undefined'
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
  $("head").append(`
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin="" />

      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
  `);

  // Adding a script tag to body via jQuery seems to add it to head as well
  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  window.document.body.appendChild(tag);
};
