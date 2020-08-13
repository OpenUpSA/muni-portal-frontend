document.getElementById('scratch').innerHTML = "It works";

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js');
  console.log("registering service worker");
} else {
  console.log("serviceWorker not supported");
};
