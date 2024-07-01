import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwcxsA1zZgCc4SE9WdQtOiISUgjCopKrc",
  authDomain: "budget-app-7fc35.firebaseapp.com",
  projectId: "budget-app-7fc35",
  storageBucket: "budget-app-7fc35.appspot.com",
  messagingSenderId: "415759329469",
  appId: "1:415759329469:web:6cd69563bfbccdcc702fd4",
  measurementId: "G-Y4EKYKLQ51",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export function chargerEnveloppesDepuisFirebase() {
  console.log("Tentative de chargement des enveloppes depuis Firebase...");
  return getDocs(collection(db, "enveloppes"))
    .then((snapshot) => {
      const enveloppes = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        enveloppes.push({ ...data, id: doc.id });
      });
      console.log("Enveloppes chargées avec succès :", enveloppes);
      return enveloppes;
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des enveloppes depuis Firebase :", error);
      throw error; // Propager l'erreur pour une gestion ultérieure
    });
}

// Ajustez la fonction registerUser
export const registerUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Utilisateur créé
      console.log(userCredential);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Ajustez la fonction loginUser
export const loginUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Utilisateur connecté
      console.log(userCredential);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Ajustez la fonction logoutUser
export const logoutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("Utilisateur déconnecté");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Ajustez la fonction checkUserStatus
export const checkUserStatus = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Utilisateur est connecté
      callback(true, user);
    } else {
      // Utilisateur n'est pas connecté
      callback(false, null);
    }
  });
};
