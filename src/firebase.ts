import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE6dDWWIIp3Te9oie8rVdQcYhG86ojwm0",
  authDomain: "edurank-4421f.firebaseapp.com",
  projectId: "edurank-4421f",
  storageBucket: "edurank-4421f.firebasestorage.app",
  messagingSenderId: "571739098662",
  appId: "1:571739098662:web:7245150e196f2d118860e7",
  measurementId: "G-BVGZL2Z93Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
