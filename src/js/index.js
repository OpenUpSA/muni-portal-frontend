import logo36x36 from '../icon/lighthouse-icon-36x36.png';
import exploreIcon from '../icon/explore-144x144.png';
import logo620x620 from '../icon/lighthouse-icon.png';

document.getElementById('scratch').innerHTML = "It works";

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js').then((reg) => {
    reg.pushManager.getSubscription().then(function(sub) {
      if (sub === null) {
        // Update UI to ask user to register for Push
        console.log('Not subscribed to push service!');

      } else {
        // We have a subscription, update the database
        console.log('Already sbscribed! Subscription object: ', sub);
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
        userVisibleOnly: true
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
        badge: logo620x620,
        icon: logo620x620,
        actions: [
          {
            action: 'explore',
            title: 'Explore this new world',
            icon: exploreIcon,
          },
          {action: 'close', title: 'Close',}
        ]
      };

      reg.showNotification('Hello world!', options);
    });
  } else {
    console.log("Clicked notify but don't have notify permission");
  }
});
