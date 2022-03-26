import type { FirebaseApp } from "firebase/app";
import type { Auth as FirebaseAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";

import { getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export const firebaseConfig = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

export const getFirebaseApp = (): FirebaseApp | undefined => {
  if (typeof window === "undefined") return; // バックエンドで実行されないようにする

  return getApps()[0] || firebaseConfig;
};

export const db = getFirestore(firebaseConfig);

export const timeStamp = serverTimestamp();

export const getFirebaseAuth = (): FirebaseAuth => {
  return getAuth(getFirebaseApp());
};

export const login = async (email: string, password: string) => {
  const auth = getFirebaseAuth();

  await signInWithEmailAndPassword(auth, email, password)
    .then(async (result) => {
      const id = await result.user.getIdToken();

      await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          alert("メールアドレスの形式が間違っています");
          break;
        case "auth/user-disabled":
          alert("無効なユーザーです");
          break;
        case "auth/user-not-found":
          alert(
            "そのメールアドレスは存在しません。アカウントを作成してください"
          );
          break;
        case "auth/wrong-password":
          alert("パスワードが違います");
          break;
        case "auth/too-many-requests":
          alert(
            "パスワードの使用回数を超えました。しばらくしてからログインしてください"
          );
          break;
        default:
          alert(error.code);
      }
    });
};

export const signUp = async (email: string, password: string) => {
  const auth = getFirebaseAuth();

  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (result) => {
      const id = await result.user.getIdToken();

      await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          alert("メールアドレスの形式が間違っています");
          break;
        case "auth/email-already-in-use":
          alert("すでに登録されたメールアドレスです。ログインしてください。");
          break;
        case "auth/invalid-password":
          alert("パスワードは6文字以上で入力してください");
          break;
        default:
          alert(error.code);
      }
    });
};

export const logout = async () => {
  await fetch("/api/sessionLogout", { method: "POST" });
};
