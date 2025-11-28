// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXvG053jrz1y_UIMgMYlT5IYKYyK02smA",
  authDomain: "menta-health-5293d.firebaseapp.com",
  projectId: "menta-health-5293d",
  storageBucket: "menta-health-5293d.firebasestorage.app",
  messagingSenderId: "671537931412",
  appId: "1:671537931412:web:8dc4e7636cb8a9ebbe4081",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);

// Correct Recaptcha Setup
export const setupRecaptcha = () => {
  if (typeof window === "undefined") return;

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
    window.recaptchaVerifier.render();
  }

  return window.recaptchaVerifier;
};

export default app;
