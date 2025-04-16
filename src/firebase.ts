import { getFirestore, type Firestore } from 'firebase/firestore'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

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

const app: FirebaseApp = initializeApp(firebaseConfig)

// Export typed services
export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)

// Optional: Export the Firebase app itself
export default db