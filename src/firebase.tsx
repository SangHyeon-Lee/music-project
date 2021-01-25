import firebase from 'firebase/app'
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDUEzme_wp01pss9CcD8TEmvrNkbkbEb1Y",
    authDomain: "kixlab-music.firebaseapp.com",
    projectId: "kixlab-music",
    storageBucket: "kixlab-music.appspot.com",
    messagingSenderId: "1022438807541",
    appId: "1:1022438807541:web:3d32f559ac72c1f710b2bc"
  };
firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default firebase;