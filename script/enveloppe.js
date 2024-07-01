class Enveloppe {
  constructor(nom = "Enveloppes", logo = "", montant = 0) {
    this.nom = nom;
    this.logo = logo;
    this.montant = montant;
    this.dateCreation = new Date();
  }

  update({ nom, logo, montant }) {
    if (nom) this.nom = nom;
    if (logo) this.logo = logo;
    if (montant !== undefined) this.montant = montant;
    this.dateCreation = new Date(); // Réinitialiser la date à chaque mise à jour
  }

  joursDepuisModification() {
    const maintenant = new Date();
    const diff = maintenant - this.dateCreation;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  render() {
    return `<div class="enveloppe-card" data-montant="${this.montant}">
                <div class="logo-categorie"><img src="${this.logo}" alt="Catégories" /></div>
                <div class="enveloppe-content">
                  <h2>${this.nom}</h2>
                  <p>Il y a ${this.joursDepuisModification()} jours</p>
                </div>
                <p class="enveloppe-money">${this.montant} €</p>
              </div>`;
  }
}

const logosParCategorie = {
  Nourriture: ["viande", "fast-food", "gateau-danniversaire", "tasse-a-cafe", "caddie", "fruit"],
  Transport: ["voiture", "taxi", "bateau", "train", "bus", "billet"],
  Charges: ["eau", "electricite", "internet", "telephone", "carburant", "argent"],
  Loisirs: ["jeu", "voyage", "livre", "peche", "pelote-de-laine", "camping"],
  Autres: [
    "produits-de-beaute",
    "rapport-medical",
    "trousse-de-premiers-secours",
    "tirelire",
    "cheque",
    "finance",
  ],
};

// Fonction pour créer et afficher la modale
function ouvrirModale() {
  let modale = document.querySelector("#modaleCreation");
  if (!modale) {
    modale = document.createElement("div");
    modale.id = "modaleCreation";
    modale.innerHTML = `
      <form id="formCreation">
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
          <button type="submit">Créer</button>
          <button type="button" id="fermerModale">Fermer</button>
        </div>
      </form>
    `;
    document.body.appendChild(modale);

    // Ajouter un écouteur d'événement pour la sélection des logos
    const logoOptions = modale.querySelectorAll(".logo-option");
    logoOptions.forEach((option) => {
      option.addEventListener("click", function () {
        logoOptions.forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");
      });
    });

    // Gérer la soumission du formulaire
    const form = modale.querySelector("#formCreation");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nom = form.nom.value;
      const montant = form.montant.value || undefined;
      const logoSelectionne = modale.querySelector(".logo-option.selected img");
      if (nom && logoSelectionne) {
        // Créer et afficher l'enveloppe
        const enveloppe = new Enveloppe();
        enveloppe.update({ nom, logo: logoSelectionne.src, montant });
        document.querySelector(".gallery").innerHTML += enveloppe.render(); // Code modifié
        calculerEtAfficherTotal();

        // Fermer la modale après la création de l'enveloppe
        modale.style.display = "none";
        form.reset(); // Réinitialiser le formulaire
        const logoOptions = modale.querySelectorAll(".logo-option");
        logoOptions.forEach((opt) => opt.classList.remove("selected")); // Désélectionner tous les logos
      } else {
        alert("Veuillez sélectionner un nom et un logo.");
      }
    });

    // Gérer le clic sur le bouton Fermer pour cacher la modale et réinitialiser le formulaire
    const fermerModaleBtn = modale.querySelector("#fermerModale");
    fermerModaleBtn.addEventListener("click", function () {
      modale.style.display = "none";
      form.reset(); // Réinitialiser le formulaire
      logoOptions.forEach((opt) => opt.classList.remove("selected")); // Désélectionner tous les logos
    });
  }

  // Afficher la modale
  modale.style.display = "block";
}

function calculerEtAfficherTotal() {
  const enveloppes = document.querySelectorAll(".enveloppe-card");
  let total = Array.from(enveloppes).reduce((acc, enveloppe) => {
    const montant = parseFloat(enveloppe.getAttribute("data-montant"));
    return acc + montant;
  }, 0);

  const totalFormate = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(total);
  document.querySelector(".total-envelope .money").textContent = totalFormate;
}

document.addEventListener("DOMContentLoaded", function () {
  calculerEtAfficherTotal();
});

document.addEventListener("DOMContentLoaded", function () {
  // Collecter tous les éléments représentant les enveloppes
  const enveloppes = document.querySelectorAll("[data-montant]");

  // Calculer le total
  let total = Array.from(enveloppes).reduce((acc, enveloppe) => {
    const montant = parseFloat(
      enveloppe.getAttribute("data-montant").replace(" €", "").replace(/\s/g, "")
    );
    return acc + montant;
  }, 0);

  // Formater le total en un format lisible (ex: 1 000 €)
  const totalFormate = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(total);

  // Afficher le total
  document.querySelector(".total-envelope .money").textContent = totalFormate;
});

const addButton = document.querySelector(".btn-add");
addButton.addEventListener("click", ouvrirModale);
