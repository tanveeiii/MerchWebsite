"use client";

import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const token = await getToken(messaging, {
    vapidKey: "BO3g0x-zAm5ejLBUN4jxF4KVTyAZGRhB42xw9z94wsKLz9q9EM7sgdIsB-du3aNGdHqwLQClPuDbEjoXe_e4t-Q",
  });

  console.log("FCM Token:", token);
  return token;
};

export const listenForegroundMessages = async () => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);
    alert(payload.notification.title);
  });
};
