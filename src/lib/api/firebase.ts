import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { getFirestore } from 'firebase/firestore';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
    type User,
} from 'firebase/auth';

import { writable } from 'svelte/store';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FB_KEY,
	authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FB_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
	appId: import.meta.env.VITE_FB_APP_ID,
	measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
//export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const store = getFirestore(app);
export const user = writable<User | null>(null);

export { collection, getDoc, setDoc, addDoc, updateDoc } from 'firebase/firestore';

export const signUpEmailAndPassword = (email: string, password: string) => {
	return createUserWithEmailAndPassword(auth, email, password);
};

export const signInEmailAndPassword = (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};
