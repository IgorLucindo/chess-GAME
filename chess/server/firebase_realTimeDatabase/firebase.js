import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjTGL4qFLCyH3OROrJZ_OpqmNfgKQMsOU",
  authDomain: "play-chess-3689b.firebaseapp.com",
  projectId: "play-chess-3689b",
  storageBucket: "play-chess-3689b.appspot.com",
  messagingSenderId: "857343887094",
  appId: "1:857343887094:web:05739e2a0c393299e30ed7"
};



// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getDatabase();