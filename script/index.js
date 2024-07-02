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

function chargerComptes(userId) {
  const userCollectionPath = `utilisateurs/${userId}/comptes`;
  const tableauComptes = []; // Étape 1: Initialiser un tableau vide
  getDocs(collection(db, userCollectionPath)).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Étape 3: Extraire le nom et le montant et les ajouter au tableau
      tableauComptes.push({ nom: data.nom, montant: data.montant });
    });
    // Étape 4: Utiliser le tableau pour afficher les informations
    afficherTableauComptes(tableauComptes);
  });
}

function afficherTableauEnveloppes(tableauEnveloppes) {
  let htmlTableau = "<table><tr><th>Nom</th><th>Montant</th></tr>";
  tableauEnveloppes.forEach((enveloppe) => {
    htmlTableau += `<tr><td>${enveloppe.nom}</td><td>${enveloppe.montant} €</td></tr>`;
  });
  htmlTableau += "</table>";
  document.querySelector(".gallery-enveloppes").innerHTML = htmlTableau; // Assurez-vous que le sélecteur correspond à votre conteneur
}

function afficherTableauComptes(tableauComptes) {
  let htmlTableau = "<table><tr><th>Nom</th><th>Montant</th></tr>";
  tableauComptes.forEach((compte) => {
    htmlTableau += `<tr><td>${compte.nom}</td><td>${compte.montant} €</td></tr>`;
  });
  htmlTableau += "</table>";
  document.querySelector(".gallery-comptes").innerHTML = htmlTableau; // Assurez-vous que le sélecteur correspond à votre conteneur
}

function calculerEtAfficherTotalCombiné() {
  // Calcul du total des enveloppes
  const enveloppes = document.querySelectorAll(".enveloppe-card");
  let totalEnveloppes = Array.from(enveloppes).reduce((acc, enveloppe) => {
    const montant = parseFloat(enveloppe.getAttribute("data-montant") || 0);
    return acc + montant;
  }, 0);

  // Calcul du total des comptes
  const comptes = document.querySelectorAll(".compte-card");
  let totalComptes = Array.from(comptes).reduce((acc, compte) => {
    const montant = parseFloat(compte.getAttribute("data-montant") || 0);
    return acc + montant;
  }, 0);

  // Addition des deux totaux
  let totalCombiné = totalEnveloppes + totalComptes;

  // Formatage et affichage du total combiné
  const totalCombinéFormate = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(totalCombiné);

  document.querySelector(".total-combined .money").textContent = totalCombinéFormate;
}

document.addEventListener("DOMContentLoaded", function () {
  checkUserStatus((isLoggedIn, user) => {
    if (isLoggedIn) {
      userId = user.uid;
      chargerComptes(userId);
      chargerEnveloppes(userId);
      calculerEtAfficherTotalCombiné();
    } else {
      console.log("Utilisateur non connecté");
    }
  });
});
