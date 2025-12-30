importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCf5kvG_tAWBG70CCmnDI-TlTQdBH6LqbU",
  authDomain: "merch-website.firebaseapp.com",
  projectId: "merch-website",
  messagingSenderId: "941499087662",
  appId: "1:941499087662:web:311f758b32a08c47edd8bf",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "globe.svg",
  });
});
