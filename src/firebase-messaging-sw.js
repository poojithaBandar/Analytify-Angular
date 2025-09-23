importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyD9j5Dn2_RBxzvVy3ZyMBSQY9NP-CX-dvU",
    authDomain: "analytify-5a041.firebaseapp.com",
    projectId: "analytify-5a041",
    storageBucket: "analytify-5a041.firebasestorage.app",
    messagingSenderId: "850090127477",
    appId: "1:850090127477:web:c864aafa9e449ce630083c",
    measurementId: "G-EYCHNRBP18"
});

const messaging = firebase.messaging();

// Background handler
// messaging.onBackgroundMessage(function(payload) {
//   console.log("[firebase-messaging-sw.js] Received background message ", payload);

//   const notificationTitle = payload.notification?.title || "Background Message";
//   const notificationOptions = {
//     body: payload.notification?.body,
//     icon: payload.notification?.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });