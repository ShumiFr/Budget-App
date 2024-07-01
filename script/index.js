// Étape 1 : Initialiser les données
let comptes = [];
let enveloppes = [];

// Étape 2 : Récupérer les données (simulation)
function recupererDonnees() {
  // Simulation de données récupérées
  comptes = [
    { nom: "Compte Courant", solde: 1200 },
    { nom: "Compte Épargne", solde: 3500 },
  ];
  enveloppes = [
    { nom: "Loisirs", montant: 150 },
    { nom: "Épicerie", montant: 250 },
  ];

  // Mise à jour de l'interface utilisateur
  afficherTotalCombine();
  genererListeComptes();
  genererListeEnveloppes();
}

// Étape 3 : Afficher le total combiné
function afficherTotalCombine() {
  const totalComptes = comptes.reduce((acc, compte) => acc + compte.solde, 0);
  const totalEnveloppes = enveloppes.reduce((acc, enveloppe) => acc + enveloppe.montant, 0);
  const totalCombine = totalComptes + totalEnveloppes;
  document.querySelector(".total-combined p:nth-child(2)").textContent = `${totalCombine} €`;
}

// Étape 4 : Générer la liste des comptes
function genererListeComptes() {
  const sectionComptes = document.querySelector(".accounts");
  comptes.forEach((compte) => {
    const item = document.createElement("p");
    item.textContent = `${compte.nom}: ${compte.solde} €`;
    sectionComptes.appendChild(item);
  });
}

// Étape 5 : Générer la liste des enveloppes
function genererListeEnveloppes() {
  const sectionEnveloppes = document.querySelector(".envelopes");
  enveloppes.forEach((enveloppe) => {
    const item = document.createElement("p");
    item.textContent = `${enveloppe.nom}: ${enveloppe.montant} €`;
    sectionEnveloppes.appendChild(item);
  });
}

// Étape 6 : Initialisation
document.addEventListener("DOMContentLoaded", recupererDonnees);
