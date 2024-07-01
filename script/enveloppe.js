let modeModale = "creation";
let dernierIdEnveloppe = 0;
let idEnveloppeActuelle = null; // Ajout pour garder une trace de l'enveloppe actuellement modifiée
let listeEnveloppes = [];

class Enveloppe {
  constructor(nom = "Enveloppes", logo = "", montant = 0) {
    this.id = ++dernierIdEnveloppe;
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

  render() {
    return `<div class="enveloppe-card" data-montant="${this.montant}" data-nom="${
      this.nom
    }" data-logo="${this.logo}" data-id="${this.id}">
              <div class="logo-categorie"><img src="${this.logo}" alt="Catégories" /></div>
              <div class="enveloppe-content">
                <h2>${this.nom}</h2>
                <p>Il y a ${this.joursDepuisModification()} jours</p>
              </div>
              <p class="enveloppe-money">${this.montant} €</p>
              <div class="enveloppe-config">
                <img src="/assets/logos/parametre.png" class="config-icon" alt="Modifier" />
                <img src="/assets/logos/effacer.png" class="delete-icon" alt="Supprimer" />
              </div>
            </div>`;
  }
}

const logosParCategorie = {
  Nourriture: ["viande", "fast-food", "gateau-danniversaire", "caddie"],
  Transport: ["voiture", "train", "bus", "billet"],
  Charges: ["eau", "internet", "telephone", "carburant"],
  Loisirs: ["jeu", "ile", "livre", "peche"],
  Autres: ["trousse-de-premiers-secours", "tirelire", "cheque", "finance"],
};

function ouvrirModale(nom = "", montant = "", logo = "", mode = "creation", idEnveloppe = null) {
  modeModale = mode;
  idEnveloppeActuelle = idEnveloppe;

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
        const enveloppe = new Enveloppe(nom, logoSrc, montant);
        document.querySelector(".gallery").innerHTML += enveloppe.render();
        listeEnveloppes.push(enveloppe);
      } else if (modeModale === "modification" && idEnveloppeActuelle !== null) {
        const enveloppeCard = document.querySelector(`[data-id="${idEnveloppeActuelle}"]`);
        if (enveloppeCard) {
          const enveloppe = retrouverEnveloppeParId(idEnveloppeActuelle);
          enveloppe.update({ nom, logo: logoSrc, montant });
          enveloppeCard.outerHTML = enveloppe.render();
        }
      }
      calculerEtAfficherTotal();
      modale.style.display = "none";
      form.reset();
      logoOptions.forEach((opt) => opt.classList.remove("selected"));
    } else {
      alert("Veuillez sélectionner un nom."); // Modifiez le message d'alerte pour refléter la validation actuelle
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

function ouvrirModalePourModification(enveloppeCard) {
  const nom = enveloppeCard.getAttribute("data-nom");
  const montant = enveloppeCard.getAttribute("data-montant");
  const logo = enveloppeCard.getAttribute("data-logo");
  const idEnveloppe = enveloppeCard.getAttribute("data-id");

  ouvrirModale(nom, montant, logo, "modification", idEnveloppe);
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".btn-config").addEventListener("click", function () {
    document.querySelectorAll(".enveloppe-config").forEach((config) => {
      config.classList.toggle("visible");
    });
  });
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-icon")) {
    e.target.closest(".enveloppe-card").remove();
    calculerEtAfficherTotal();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("config-icon")) {
    const enveloppeCard = e.target.closest(".enveloppe-card");
    ouvrirModalePourModification(enveloppeCard);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  calculerEtAfficherTotal();
});

const addButton = document.querySelector(".btn-add");
addButton.addEventListener("click", () => ouvrirModale());

function retrouverEnveloppeParId(id) {
  return listeEnveloppes.find((enveloppe) => enveloppe.id === parseInt(id, 10)) || null;
}
