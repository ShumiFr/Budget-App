import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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

export const registerUser = (email, password) => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Utilisateur créé
      console.log(userCredential);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const loginUser = (email, password) => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Utilisateur connecté
      console.log(userCredential);
    })
    .catch((error) => {
      console.error(error);
    });
};

// Déconnexion de l'utilisateur
export const logoutUser = () => {
  auth
    .signOut()
    .then(() => {
      console.log("Utilisateur déconnecté");
    })
    .catch((error) => {
      console.error(error);
    });
};

// Vérification de l'état de connexion de l'utilisateur
export const checkUserStatus = (callback) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Utilisateur est connecté
      callback(true, user);
    } else {
      // Utilisateur n'est pas connecté
      callback(false, null);
    }
  });
};
