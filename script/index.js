import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from "../data/firebase.js";
import { checkUserStatus } from "../data/firebase.js";

let userId = null;

function chargerEnveloppes(userId) {
  const userCollectionPath = `utilisateurs/${userId}/enveloppes`;
  const tableauEnveloppes = []; // Étape 1: Initialiser un tableau vide
  getDocs(collection(db, userCollectionPath)).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Étape 3: Extraire le nom et le montant et les ajouter au tableau
      tableauEnveloppes.push({ nom: data.nom, montant: data.montant });
    });
    // Étape 4: Utiliser le tableau pour afficher les informations
    afficherTableauEnveloppes(tableauEnveloppes);
  });
}

function afficherTableauEnveloppes(tableauEnveloppes) {
  let htmlTableau = "<table><tr><th>Nom</th><th>Montant</th></tr>";
  tableauEnveloppes.forEach((enveloppe) => {
    htmlTableau += `<tr><td>${enveloppe.nom}</td><td>${enveloppe.montant} €</td></tr>`;
  });
  htmlTableau += "</table>";
  document.querySelector(".gallery").innerHTML = htmlTableau; // Assurez-vous que le sélecteur correspond à votre conteneur
}

document.addEventListener("DOMContentLoaded", function () {
  checkUserStatus((isLoggedIn, user) => {
    if (isLoggedIn) {
      userId = user.uid;
      chargerEnveloppes(userId);
    } else {
      console.log("Utilisateur non connecté");
    }
  });
});
