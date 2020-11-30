import urlB64ToUint8Array from './urlB64ToUint8Array';

document.getElementById('scratch').innerHTML = "It works";

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js').then((reg) => {
    reg.pushManager.getSubscription().then(function(sub) {
      if (sub === null) {
        // Update UI to ask user to register for Push
        console.log('Not subscribed to push service!');

      } else {
        // We have a subscription, update the database
        console.log('Already sbscribed! Subscription object: ', sub.toJSON());
      }
    }).catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  });

  console.log("registering service worker");
} else {
  console.log("serviceWorker not supported");
};



$("#btnSubscribeNotifications").on("click", () => {
  Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
  });

  if('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(reg) {
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array("BLlRbWaGLUxLA_sCI3Opgf5r8XMBMzlQ7QDUh61N93T-lt8NRLX015HNlQd48DQZ6kfObf-k42VQ0q_EMHjo6KA"),
      }).then(function(sub) {
        console.log("Subscribed to push!", sub);
      }).catch(function(e) {
        if (Notification.permission === 'denied') {
          console.warn('Permission for notifications was denied');
        } else {
          console.error('Unable to subscribe to push', e);
        }
      });
    });
  }
});

$("#btnShowNotification").on("click", () => {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.ready.then(function(reg) {
      const options = {
        body: 'Here is a notification body!',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
          {action: 'explore', title: 'Explore',},
          {action: 'close', title: 'Close',}
        ]
      };

      reg.showNotification('Hello world!', options);
    });
  }
});
