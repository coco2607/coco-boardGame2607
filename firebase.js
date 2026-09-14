// firebase.js

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    remove,
    push,
    onValue,
    onDisconnect,
    serverTimestamp,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDkEtbhFu063SzveYyogGj2h_IIWJ3BxUk",
    authDomain: "dice2607.firebaseapp.com",
    databaseURL: "https://dice2607-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dice2607",
    storageBucket: "dice2607.firebasestorage.app",
    messagingSenderId: "308468191758",
    appId: "기존 실제 appId"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {
    db,
    ref,
    get,
    set,
    update,
    remove,
    push,
    onValue,
    onDisconnect,
    serverTimestamp,
    runTransaction
};