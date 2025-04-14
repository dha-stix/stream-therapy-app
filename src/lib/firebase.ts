import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvA_HsGya_hU_U1ik_vfeitzCXXsuB8Po",
  authDomain: "therapy-dcabf.firebaseapp.com",
  projectId: "therapy-dcabf",
  storageBucket: "therapy-dcabf.firebasestorage.app",
  messagingSenderId: "778180299613",
  appId: "1:778180299613:web:7117126865874c44cd36b4"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth, storage };
export default db;