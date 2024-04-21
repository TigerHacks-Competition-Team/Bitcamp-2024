import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { collection, getFirestore, doc } from 'firebase/firestore';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
    type User,
} from 'firebase/auth';

import { writable } from 'svelte/store';
import { onMount } from 'svelte';
import { browser } from '$app/environment';

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

auth.onAuthStateChanged(u => {
	user.set(u);
	/*
	if (browser) {
		if (!u && !(window.location.pathname.includes("/auth") || window.location.pathname == "/")) {
			window.location.pathname = "/auth/sign-in/"
		}
		if (u && window.location.pathname.includes("/auth")) {
			window.location.pathname = "/home"
		}
	}
	*/
});

export const getUser: () => Promise<User> = () => new Promise(res => {
	const unsub = user.subscribe(u => {
		if (u) {
			res(u);
			unsub();
		}
	});
});

export const usersRef = collection(store, "users");
export const poolsRef = collection(store, "pools");

export const signUpEmailAndPassword = (email: string, password: string) => {
	return createUserWithEmailAndPassword(auth, email, password);
};

export const signInEmailAndPassword = (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};
