// firebase-messaging-sw.js

// Firebase SDKs ke liye scripts (service worker mein 'compat' version use hote hain)
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Aapke Firebase Project ki Configuration Details
const firebaseConfig = {
    apiKey: "AIzaSyCFihnVTG6qLoREqmwIo1dPTVazUX6S_ec",
    authDomain: "chatting-app-5b3fb.firebaseapp.com",
    databaseURL: "https://chatting-app-5b3fb-default-rtdb.firebaseio.com",
    projectId: "chatting-app-5b3fb",
    storageBucket: "chatting-app-5b3fb.appspot.com",
    messagingSenderId: "44665165613",
    appId: "1:44665165613:web:cb978ce54b4216c776e5a4",
    measurementId: "G-TKFLVWKZ6H"
};
// --- FIREBASE CONFIG END ---

// Service worker mein Firebase app ko initialize karein
firebase.initializeApp(firebaseConfig);

// Firebase Messaging ka instance lein taaki background messages handle ho sakein
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message receive hua: ', payload);

  // Notification ko customize karein
  const notificationTitle = payload.notification?.title || 'Chat App Naya Message';
  const notificationOptions = {
    body: payload.notification?.body || 'Aapke liye naya message hai.',
    icon: '/app-icon-192.png', // Agar aapne icon rakha hai root mein, toh yeh kaam karega
    // Aap yahaan apne app ka icon daal sakte hain, e.g., '/images/my-app-icon.png'
    // data: { // Click action ke liye data (optional)
    //   url: payload.data?.url || '/' // Default: app ka root page kholega
    // }
  };

  // Notification dikhayein
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Notification par click karne par kya ho
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click hua: ', event.notification);
  event.notification.close(); // Notification ko band karein

  // Client windows ko focus karne ya naya window kholne ki koshish karein
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // Agar app ka koi tab/window pehle se khula hai, use focus karein
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Agar koi window nahi khula hai, toh naya kholo app ke root URL par
      if (clients.openWindow) {
        return clients.openWindow(self.location.origin);
      }
    })
  );
});
