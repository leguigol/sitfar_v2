import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig={
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

};

const app=initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db = getFirestore(app)

export const login=({email,password})=>{
    return signInWithEmailAndPassword(auth,email,password);

}

export const register=({email,password})=>{
    return createUserWithEmailAndPassword(auth,email,password);
};


export const logout=()=>{
    return signOut(auth);
}

export const passwordReset = async (email) => {
    return await sendPasswordResetEmail(auth, email)
}