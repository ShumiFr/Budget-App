const firebaseConfig = {
  apiKey: "AIzaSyAwcxsA1zZgCc4SE9WdQtOiISUgjCopKrc",
  authDomain: "budget-app-7fc35.firebaseapp.com",
  projectId: "budget-app-7fc35",
  storageBucket: "budget-app-7fc35.appspot.com",
  messagingSenderId: "415759329469",
  appId: "1:415759329469:web:6cd69563bfbccdcc702fd4",
  measurementId: "G-Y4EKYKLQ51",
};

firebase.initializeApp(firebaseConfig);

// Étape 5 : Authentification Firebase dans le frontend
const auth = firebase.auth();

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

// Réinitialisation du mot de passe
export const resetPassword = (email) => {
  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      console.log("Email de réinitialisation envoyé");
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
