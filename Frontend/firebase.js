import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "vingo-food-delivery-7fc23.firebaseapp.com",
  projectId: "vingo-food-delivery-7fc23",
  storageBucket: "vingo-food-delivery-7fc23.firebasestorage.app",
  messagingSenderId: "848443617888",
  appId: "1:848443617888:web:0615d642a5f80802df4905"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {app,auth}