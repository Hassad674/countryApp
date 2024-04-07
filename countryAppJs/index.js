class CountryManager {
  constructor() {
    // Sélection des éléments DOM
    this.countriesContainer = document.querySelector(".countries-container");
    this.inputSearch = document.getElementById("inputSearch");
    this.inputRange = document.getElementById("inputRange");
    this.rangeValue = document.getElementById("rangeValue");
    this.btnSort = document.querySelectorAll(".btnSort");

    // Initialisation des données
    this.countriesData = [];
    this.sortMethod = "maxToMin";

    // Appel de la méthode d'initialisation
    this.initialize();
  }

  async initialize() {
    // Chargement des données des pays
    await this.fetchCountries();
    // Ajout des écouteurs d'événements
    this.addEventListeners();
    // Affichage des pays
    this.countriesDisplay();
  }

  async fetchCountries() {
    try {
      // Récupération des données des pays depuis l'API
      const response = await fetch("https://restcountries.com/v3.1/all");
      this.countriesData = await response.json();
    } catch (error) {
      console.error("Erreur lors du chargement des pays :", error);
    }
  }

  addEventListeners() {
    // Définition des événements et des éléments associés
    const events = {
      input: {
        inputSearch: this.inputSearch,
        inputRange: this.inputRange
      },
      click: {
        minToMax: this.btnSort[0],
        maxToMin: this.btnSort[1],
        alpha: this.btnSort[2]
      }
    };

    // Ajout des écouteurs d'événements
    Object.entries(events).forEach(([eventType, elements]) => {
      Object.entries(elements).forEach(([elementId, element]) => {
        element.addEventListener(eventType, () => {
          if (eventType === "input" && elementId === "inputRange") {
            // Mise à jour de la valeur affichée pour le curseur de plage
            this.rangeValue.textContent = element.value;
          } else if (eventType === "click") {
            // Mise à jour de la méthode de tri sélectionnée
            this.sortMethod = elementId;
          }
          // Actualisation de l'affichage des pays
          this.countriesDisplay();
        });
      });
    });
  }

  countriesDisplay() {
    // Affichage des pays filtrés et triés
    this.countriesContainer.innerHTML = this.countriesData
      .filter((country) =>
        country.translations.fra.common
          .toLowerCase()
          .includes(this.inputSearch.value.toLowerCase())
      )
      .sort((a, b) => {
        if (this.sortMethod === "maxToMin") {
          return b.population - a.population;
        } else if (this.sortMethod === "minToMax") {
          return a.population - b.population;
        } else if (this.sortMethod === "alpha") {
          return a.translations.fra.common.localeCompare(
            b.translations.fra.common
          );
        }
      })
      .slice(0, this.inputRange.value)
      .map(
        (country) =>
          `
          <div class="card">
            <img src=${country.flags.svg} alt="drapeau ${
            country.translations.fra.common
          }" > 
            <div class="card-content">
              <h2>${country.translations.fra.common}</h2>
              <h4>${country.capital}</h4>
              <p>Population : ${country.population.toLocaleString()}</p>
            </div>
          </div>
        `
      )
      .join("");
  }
}

// Création d'une instance de CountryManager lorsque la page est chargée
window.addEventListener("load", () => new CountryManager());
