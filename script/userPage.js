import { loginUser, registerUser, logoutUser, checkUserStatus } from "../data/firebase.js";

document.addEventListener("DOMContentLoaded", function () {
  checkUserStatus((isLoggedIn, user) => {
    if (isLoggedIn) {
      console.log("Utilisateur connecté:", user);
      // Afficher la section utilisateur au lieu de rediriger
      document.getElementById("sectionInfosUtilisateur").style.display = "flex";
      document.getElementById("sectionConnexion").style.display = "none";
      document.getElementById("sectionInscription").style.display = "none";
    } else {
      console.log("Utilisateur non connecté");
      document.getElementById("sectionConnexion").style.display = "flex";
      document.getElementById("sectionInscription").style.display = "flex";
    }
  });
});

document.getElementById("formInscription").addEventListener("submit", function (e) {
  e.preventDefault(); // Empêche le formulaire de soumettre de manière traditionnelle

  const email = document.getElementById("emailInscription").value;
  const password = document.getElementById("passwordInscription").value;

  registerUser(email, password).then(() => {
    console.log("Utilisateur créé");
    // Afficher la section utilisateur après l'inscription
    document.getElementById("sectionInfosUtilisateur").style.display = "flex";
    document.getElementById("sectionConnexion").style.display = "none";
    document.getElementById("sectionInscription").style.display = "none";
  });
});

document.getElementById("formConnexion").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailConnexion").value;
  const password = document.getElementById("passwordConnexion").value;

  loginUser(email, password).then(() => {
    // Afficher la section utilisateur après la connexion
    document.getElementById("sectionInfosUtilisateur").style.display = "flex";
    document.getElementById("sectionConnexion").style.display = "none";
    document.getElementById("sectionInscription").style.display = "none";
  });
});

document.querySelector(".btnDeconnexion").addEventListener("click", (e) => {
  logoutUser().then(() => {
    window.location.reload();
  });
});
