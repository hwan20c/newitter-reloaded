import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB69uumG3h9z9IbbhVa-Ui-6dr4KZ-Z-Gg",
  authDomain: "nwitter-reroaded.firebaseapp.com",
  projectId: "nwitter-reroaded",
  storageBucket: "nwitter-reroaded.appspot.com",
  messagingSenderId: "959397877734",
  appId: "1:959397877734:web:df671a8789a1ca81042827",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
