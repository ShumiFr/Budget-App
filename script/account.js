let modeModale = "creation";
let dernierIdCompte = 0;
let idCompteActuel = null;
let listeComptes = [];
import { db, checkUserStatus } from "../data/firebase.js";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

let userId = null;

class Compte {
  constructor(nom = "Compte", logo = "", montant = 0) {
    this.id = ++dernierIdCompte;
    this.nom = nom;
    this.logo = logo;
    this.montant = montant;
    this.dateCreation = new Date();
  }

  update({ nom, logo, montant }) {
    if (nom) this.nom = nom;
    if (logo) this.logo = logo;
    if (montant !== undefined) this.montant = montant;
    this.dateCreation = new Date();
  }

  joursDepuisModification() {
    const maintenant = new Date();
    const diff = maintenant - this.dateCreation;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  save(userId) {
    const userCollectionPath = `utilisateurs/${userId}/comptes`;
    if (this.firestoreId) {
      // Mise à jour de l'enveloppe existante
      const compteRef = doc(db, userCollectionPath, this.firestoreId);
      return updateDoc(compteRef, {
        nom: this.nom,
        logo: this.logo,
        montant: this.montant,
        dateCreation: this.dateCreation,
      });
    } else {
      // Création d'une nouvelle enveloppe
      return addDoc(collection(db, userCollectionPath), {
        nom: this.nom,
        logo: this.logo,
        montant: this.montant,
        dateCreation: this.dateCreation,
      }).then((docRef) => {
        this.firestoreId = docRef.id; // Firestore génère un ID de type string
      });
    }
  }

  static delete(id) {
    return deleteDoc(doc(db, "comptes", id));
  }

  render() {
    return `<div class="compte-card" data-montant="${this.montant}" data-nom="${
      this.nom
    }" data-logo="${this.logo}" data-id="${this.id}">
                <div class="logo-categorie"><img src="${this.logo}" alt="Catégories" /></div>
                <div class="compte-content">
                  <h2>${this.nom}</h2>
                  <p>Il y a ${this.joursDepuisModification()} jours</p>
                </div>
                <p class="compte-money">${this.montant} €</p>
                <div class="compte-config">
                  <img src="/assets/logos/parametre.png" class="config-icon" alt="Modifier" />
                  <img src="/assets/logos/effacer.png" class="delete-icon" alt="Supprimer" />
                </div>
              </div>`;
  }
}

const logosParCategorie = {
  Nourriture: [
    "viande",
    "fast-food",
    "gateau-danniversaire",
    "caddie",
    "chocolat",
    "fruit",
    "tasse-a-cafe",
  ],
  Transport: ["voiture", "train", "bus", "billet", "bateau", "frontiere", "taxi", "avion", "velo"],
  Frais: [
    "eau",
    "electricite",
    "internet",
    "telephone",
    "carburant",
    "gaz",
    "radiateur",
    "poubelle",
    "veterinaire",
    "seringue",
    "medicament",
    "rapport-medical",
    "reparation",
  ],
  Loisirs: [
    "jeu",
    "ile",
    "livre",
    "peche",
    "camping",
    "clap",
    "musique",
    "peinture",
    "pelote-de-laine",
    "puzzle",
    "voyage",
    "course",
    "football",
    "halteres",
  ],
  Finances: [
    "banque",
    "portefeuille",
    "argent",
    "tirelire",
    "cheque",
    "finance",
    "budget",
    "loi",
    "prelevement",
  ],
  Autres: [
    "trousse-de-premiers-secours",
    "boite",
    "carte",
    "confettis",
    "produits-de-beaute",
    "cadeau",
    "paques",
    "noel",
    "halloween",
    "maison",
    "sirene",
    "chien",
  ],
};

function chargerComptes(userId) {
  const userCollectionPath = `utilisateurs/${userId}/comptes`;
  getDocs(collection(db, userCollectionPath)).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const compte = new Compte(data.nom, data.logo, data.montant);
      compte.firestoreId = doc.id; // Assurez-vous d'assigner l'ID de Firestore à l'instance de l'enveloppe
      listeComptes.push(compte);
      document.querySelector(".gallery").innerHTML += compte.render(); // Assurez-vous que le sélecteur correspond à votre conteneur d'enveloppes
    });
    calculerEtAfficherTotal(); // Mettez à jour le total après avoir chargé toutes les enveloppes
  });
}

function ouvrirModale(nom = "", montant = "", logo = "", mode = "creation", idCompte = null) {
  modeModale = mode;
  idCompteActuel = idCompte;

  let modale = document.querySelector("#modaleCreation");
  if (!modale) {
    modale = document.createElement("div");
    modale.id = "modaleCreation";
    modale.innerHTML = `
        <form id="formCreation">
          <h2>Création d'un compte</h2>
          <label for="nom">Nom:</label>
          <input type="text" id="nom" name="nom" required>
          
          <label for="montant">Montant (optionnel):</label>
          <input type="number" id="montant" name="montant">
          
          <div id="logos">
            ${Object.entries(logosParCategorie)
              .map(
                ([categorie, logos]) => `
              <div class="categorie">
                <h3>${categorie}</h3>
                <div class="logos">
                  ${logos
                    .map(
                      (logo) => `
                    <div class="logo-option"><img src="/assets/logos/${logo}.png" alt="${logo}"></div>
                  `
                    )
                    .join("")}
                  </div>
              </div>
            `
              )
              .join("")}
          </div>
  
          <div id="buttons">
            <button type="submit">${mode === "creation" ? "Créer" : "Modifier"}</button>
            <button type="button" id="fermerModale">Fermer</button>
          </div>
        </form>
      `;
    document.body.appendChild(modale);

    // Ajout des gestionnaires d'événements ici pour éviter la duplication
  }

  // Mise à jour du bouton de soumission selon le mode
  modale.querySelector("#buttons button[type='submit']").textContent =
    mode === "creation" ? "Créer" : "Modifier";

  const logoOptions = modale.querySelectorAll(".logo-option");
  logoOptions.forEach((option) => {
    option.addEventListener("click", function () {
      logoOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  const form = modale.querySelector("#formCreation");
  form.removeEventListener("submit", handleFormSubmit); // Supprime l'ancien gestionnaire pour éviter les duplications
  form.addEventListener("submit", handleFormSubmit); // Ajoute le nouveau gestionnaire

  function handleFormSubmit(e) {
    e.preventDefault();
    const nom = form.nom.value.trim(); // Assurez-vous que le nom est bien récupéré et nettoyé des espaces inutiles
    const montant = form.montant.value ? parseFloat(form.montant.value) : undefined; // Convertit le montant en nombre si présent, sinon undefined
    const logoSelectionne = modale.querySelector(".logo-option.selected img");
    const logoSrc = logoSelectionne ? logoSelectionne.getAttribute("src") : ""; // Utilise un logo vide si aucun n'est sélectionné

    // Vérifie uniquement si le nom est présent, permettant la création/modification sans logo sélectionné
    if (nom) {
      if (modeModale === "creation") {
        const compte = new Compte(nom, logoSrc, montant);
        document.querySelector(".gallery").innerHTML += compte.render();
        listeComptes.push(compte);
        compte.save(userId); // Ajout de cette ligne pour sauvegarder la nouvelle enveloppe
      } else if (modeModale === "modification" && idCompteActuel !== null) {
        // Lors de la modification d'une enveloppe existante
        const compteCard = document.querySelector(`[data-id="${idCompteActuel}"]`);
        if (compteCard) {
          const compte = retrouverCompteParId(idCompteActuel);
          compte.update({ nom, logo: logoSrc, montant });
          compteCard.outerHTML = compte.render();
          compte.save(userId); // Ajout de cette ligne pour mettre à jour l'enveloppe
        }
      }
      calculerEtAfficherTotal();
      modale.style.display = "none";
      form.reset();
      logoOptions.forEach((opt) => opt.classList.remove("selected"));
    }
  }

  const fermerModaleBtn = modale.querySelector("#fermerModale");
  fermerModaleBtn.addEventListener("click", function () {
    modale.style.display = "none";
    form.reset();
    logoOptions.forEach((opt) => opt.classList.remove("selected"));
  });

  if (nom) modale.querySelector("#nom").value = nom;
  if (montant) modale.querySelector("#montant").value = montant;
  if (logo) {
    const logoOptions = modale.querySelectorAll(".logo-option img");
    logoOptions.forEach((option) => {
      if (option.src === logo) {
        option.parentElement.classList.add("selected");
      } else {
        option.parentElement.classList.remove("selected");
      }
    });
  }

  modale.style.display = "block";
}

function calculerEtAfficherTotal() {
  const comptes = document.querySelectorAll(".compte-card");
  let total = Array.from(comptes).reduce((acc, compte) => {
    const montant = parseFloat(compte.getAttribute("data-montant"));
    return acc + montant;
  }, 0);

  const totalFormate = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(total);
  document.querySelector(".total-account .money").textContent = totalFormate;
}

function ouvrirModalePourModification(compteCard) {
  const nom = compteCard.getAttribute("data-nom");
  const montant = compteCard.getAttribute("data-montant");
  const logo = compteCard.getAttribute("data-logo");
  const idCompte = compteCard.getAttribute("data-id");

  ouvrirModale(nom, montant, logo, "modification", idCompte);
}

document.addEventListener("DOMContentLoaded", function () {
  checkUserStatus((isLoggedIn, user) => {
    if (isLoggedIn) {
      userId = user.uid;
      chargerComptes(userId);
    } else {
      console.log("Utilisateur non connecté");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".btn-config").addEventListener("click", function () {
    document.querySelectorAll(".compte-config").forEach((config) => {
      config.classList.toggle("visible");
    });
  });
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-icon")) {
    e.target.closest(".compte-card").remove();
    calculerEtAfficherTotal();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("config-icon")) {
    const compteCard = e.target.closest(".compte-card");
    ouvrirModalePourModification(compteCard);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  calculerEtAfficherTotal();
});

const addButton = document.querySelector(".btn-add");
addButton.addEventListener("click", () => ouvrirModale());

function retrouverCompteParId(id) {
  return listeComptes.find((compte) => compte.id === parseInt(id, 10)) || null;
}
