import "https://deno.land/x/dotenv/load.ts";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore-lite.js";

const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
