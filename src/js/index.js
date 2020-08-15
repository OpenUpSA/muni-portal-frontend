document.getElementById('scratch').innerHTML = "It works";

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js');
  console.log("registering service worker");
} else {
  console.log("serviceWorker not supported");
};



$("#btnSubscribeNotifications").on("click", () => {
  Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
  });
});

$("#btnShowNotification").on("click", () => {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      const options = {
        body: 'Here is a notification body!',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
          {action: 'explore', title: 'Explore this new world',},
          {action: 'close', title: 'Close notification',}
        ]
      };

      reg.showNotification('Hello world!', options);
    });
  }
});
