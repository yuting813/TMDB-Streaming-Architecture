// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// CI 環境攔截：在 GitHub Actions Build 階段跳過 Firebase 真實初始化
// 避免 mock 環境變數導致 Firebase 連線失敗，搭配 .github/workflows/ci.yml 使用
const isCI = process.env.NEXT_PUBLIC_IS_CI === 'true';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !isCI
	? !getApps().length
		? initializeApp(firebaseConfig)
		: getApp()
	: (getApps()[0] ?? initializeApp(firebaseConfig));
const db = getFirestore(app);
const auth = getAuth(app);

export default app;
export { auth, db };
