import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCDLJglb3zXWr9xxANBpdR6_2IfX-fOfI4",
  authDomain: "music-643af.firebaseapp.com",
  projectId: "music-643af",
  storageBucket: "music-643af.appspot.com",
  messagingSenderId: "382676224813",
  appId: "1:382676224813:web:27c218d636230c29ec21a4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)