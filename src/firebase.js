import firebase from '@firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCG6GPbj83IzhcqDv3700cQP3oBVuHNtBY",
  authDomain: "mpos-dbce8.firebaseapp.com",
  projectId: "mpos-dbce8",
  storageBucket: "mpos-dbce8.appspot.com",
  messagingSenderId: "139969501580",
  appId: "1:139969501580:web:0e05cbe72050868a975ea9"
  /*
  apiKey: "AIzaSyD1sOpbh3wHfhvjPAClF7NXv5D-QJF5ddY",
  authDomain: "mpos-17801.firebaseapp.com",
  projectId: "mpos-17801",
  storageBucket: "mpos-17801.appspot.com",
  messagingSenderId: "457327738469",
  appId: "1:457327738469:web:a3674a6c3d03b46209908c"
  */
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().enablePersistence()

export default {
    db: firebaseApp.firestore()
}