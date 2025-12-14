// src/app/firebase.config.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "localhost",
  projectId: "demo-no-project", // ✅ match emulator project ID
  storageBucket: "demo-no-project.appspot.com", // ✅ match storage bucket in emulator
};

// ✅ Prevent multiple initializations
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// ✅ Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Temporarily suppress emulator console spam (optional)
const originalConsoleLog = console.log;
console.log = (...args) => {
  const msg = args.join(" ");
  if (msg.includes("Emulator") || msg.includes("Running in emulator mode")) return;
  originalConsoleLog(...args);
};

// ✅ Emulator connections
connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);
connectStorageEmulator(storage, "localhost", 9199);

// ✅ (Optional) restore console.log if needed
// console.log = originalConsoleLog;

export { app, auth, db, storage };
