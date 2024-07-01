import { loginUser, registerUser, logoutUser, checkUserStatus } from "../data/firebase.js";

document.addEventListener("DOMContentLoaded", function () {
  checkUserStatus((isLoggedIn, user) => {
    if (isLoggedIn) {
      console.log("Utilisateur connecté:", user);
      // Rediriger vers la page des enveloppes si déjà connecté
      window.location.href = "/pages/enveloppePage.html";
    } else {
      console.log("Utilisateur non connecté");
      document.getElementById("sectionConnexion").style.display = "block";
      document.getElementById("sectionInscription").style.display = "block";
    }
  });
});

document.getElementById("formInscription").addEventListener("submit", function (e) {
  e.preventDefault(); // Empêche le formulaire de soumettre de manière traditionnelle

  const email = document.getElementById("emailInscription").value;
  const password = document.getElementById("passwordInscription").value;

  registerUser(email, password).then(() => {
    console.log("Utilisateur créé");
    // Rediriger vers la page des enveloppes après l'inscription
    window.location.href = "/pages/enveloppePage.html";
  });
});

document.getElementById("formConnexion").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailConnexion").value;
  const password = document.getElementById("passwordConnexion").value;

  loginUser(email, password).then(() => {
    // Rediriger vers la page des enveloppes après la connexion
    window.location.href = "/pages/enveloppePage.html";
  });
});

document.getElementById("boutonDeconnexion").addEventListener("click", (e) => {
  logoutUser().then(() => {
    // Optionnel : Rediriger vers la page d'accueil après la déconnexion
    window.location.href = "/pages/enveloppePage.html";
  });
});
