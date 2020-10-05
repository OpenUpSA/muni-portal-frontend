exports.transform = function(window, $) {
  $("head").prepend("<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NP4BJ8C');</script><!-- End Google Tag Manager -->");
  $("body").prepend('<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NP4BJ8C"height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->');
  $("head").append('<meta name="theme-color" content="#0094ff">');

  // Adding a script tag to body via jQuery seems to add it to head as well
  const tag = window.document.createElement("script");
  tag.setAttribute("src", "js/index.js");
  window.document.body.appendChild(tag);
};
