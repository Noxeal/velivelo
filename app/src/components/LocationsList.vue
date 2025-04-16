<template>
    <div class="locations-list">
      <h1>Liste des locations</h1>
  
      <!-- En-tête -->
      <div class="location-item header">
        <div class="location-col">
          <p><strong>Id du vélo</strong></p>
          <p><strong>Nom du vélo</strong></p>
        </div>
        <div class="location-col">
          <p><strong>Nom</strong></p>
          <p><strong>Prénom</strong></p>
        </div>
        <div class="location-col">
          <p><strong>État</strong></p>
        </div>
        <div class="location-col">
          <p><strong>Date de début</strong></p>
        </div>
        <div class="location-col">
          <p><strong>Date de fin</strong></p>
        </div>
      </div>
  
      <!-- Lignes des données -->
      <div
        v-for="location in locations_list"
        :key="location.id"
        class="location-item"
      >
        <div class="location-col hoverable">
          <p>{{ location.id_velo }}</p>
          <p>{{ location.nom_velo }}</p>
        </div>
        <div class="location-col hoverable">
          <p>{{ location.nom }}</p>
          <p>{{ location.prenom }}</p>
        </div>
        <div class="location-col hoverable">
          <p>{{ location.etat }}</p>
        </div>
        <div class="location-col hoverable">
          <p>{{ new Date(location.date_debut).toLocaleDateString('fr-FR') }}</p>
        </div>
        <div class="location-col hoverable">
          <p>{{ new Date(location.date_fin_estimee).toLocaleDateString('fr-FR') }}</p>
        </div>
      </div>
  
      <!-- Message si vide -->
      <div v-if="locations_list.length === 0">
        <p>Aucune location trouvée.</p>
      </div>
      <div v-else>
        <p>Nombre de locations: {{ locations_list.length }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        locations_list: [],
      };
    },
    async created() {
      await this.fetchLocations();
    },
    methods: {
      async fetchLocations() {
        try {
          const response = await fetch("http://localhost:3000/location_list/");
          if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            this.locations_list = data;
            console.log("Données des locations :", this.locations_list);
          } else {
            console.warn("Les données reçues ne sont pas un tableau :", data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .locations-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: var(--color-dark-blue);
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
  }
  
  .location-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--color-pink);
    color: var(--color-dark-blue);
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
    gap: 10px;
  }
  
  .location-col {
    flex: 1;
    padding: 0.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-radius: 8px;
  }
  
  /* Hover uniquement sur les éléments interactifs */
  .hoverable:hover {
    background-color: var(--color-soft-blue);
    transition: background-color 0.3s;
    cursor: pointer;
  }
  
  .header {
    font-weight: bold;
    background-color: var(--color-dark-blue);
    color: white;
  }
  
  h1 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 10px;
    color: var(--color-dark-blue);
  }
  </style>
  