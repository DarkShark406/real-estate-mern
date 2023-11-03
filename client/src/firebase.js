// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mern-real-estate-73aa6.firebaseapp.com",
	projectId: "mern-real-estate-73aa6",
	storageBucket: "mern-real-estate-73aa6.appspot.com",
	messagingSenderId: "399288913593",
	appId: "1:399288913593:web:2d7eb1fe6e33a26e455568",
	measurementId: "G-26ND53P8MG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
