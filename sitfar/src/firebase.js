import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCov-0pHdnLaHNL4qW--XFdA7rkSHZFhgQ",
  authDomain: "sitfar-17933.firebaseapp.com",
  projectId: "sitfar-17933",
  storageBucket: "sitfar-17933.appspot.com",
  messagingSenderId: "913134483049",
  appId: "1:913134483049:web:5e70044218c7e3412454f8"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app);

export {auth};