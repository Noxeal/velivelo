<template>
    <div class="locations-list">
      <h1>Liste des locations</h1>
  
      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom du client ou vélo..."
        />
      </div>
      <label v-if="is_gerant" class="gerant-checkbox">
        <input type="checkbox" v-model="showOnlyMine" />
        Voir uniquement mes locations
      </label>
  
      <!-- Header -->
      <div class="location-item header">
        <div class="location-col">
          <p><strong>Id du vélo</strong></p>
          <p><strong>Nom du vélo</strong></p>
        </div>
        <div class="location-col">
          <p><strong>Nom client</strong></p>
          <p><strong>Prénom client</strong></p>
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
        <div class="location-col">
          <p><strong>Prix</strong></p>
        </div>
        <div class="location-col">
          <p><strong>Paiement actuel</strong></p>
        </div>
        <div class="location-col">
          <p><strong>Gérant en charge</strong></p>
        </div>
        <div class="location-actions-header">
          <p><strong>Actions</strong></p>
        </div>
      </div>
  
      <!-- Lignes -->
      <div
        v-for="location in filteredLocations"
        :key="location.id_location"
        class="location-item"
      >
  
        <div class="location-col hoverable" @click="openVeloModal(location)">
          <p>{{ location.id_velo }}</p>
          <p>{{ location.nom_velo }}</p>
        </div>
  
        <div class="location-col hoverable" @click="openClientModal(location.id_client)">
          <p>{{ location.nom_client }}</p>
          <p>{{ location.prenom_client }}</p>
        </div>
        <div class="location-col">
          <p>{{ location.etat }}</p>
        </div>
        <div class="location-col">
          <p>{{ formatDate(location.date_debut) }}</p>
        </div>
        <div class="location-col">
          <p>{{ formatDate(location.date_fin_estimee) }}</p>
        </div>
        <div class="location-col">
          <p>{{ calculateTotalPrice(location) }} €</p>
        </div>
        <div class="location-col">
          <p>{{ location.paiement_actuel }}</p>
        </div>
        <div class="location-col">
          <div v-if="location.nom_gerant && location.prenom_gerant">
            <p>{{ location.nom_gerant }}</p>
            <p>{{ location.prenom_gerant }}</p>
          </div>
          <div v-else>
            <p><em>Aucun gérant</em></p>
          </div>
        </div>
  
        <div class="location-actions">
          <button @click="openClientModal(location.id_client)">👤</button>
          <button @click="openVeloModal(location)">🚲</button>
          <button @click="openEditModal(location)">✏️</button>
          <button v-if="location.etat == 'En attente'" @click="openDeleteModal(location.id_location)">🗑️</button>
        </div>
      </div>
  
      <div v-if="locations_list.length === 0">
        <p>Aucune location trouvée.</p>
      </div>
      <div v-else>
        <p>Nombre de locations: {{ locations_list.length }}</p>
      </div>
  
      <!-- Modales existantes -->
      <Modal v-if="showVeloModal" @close="closeModal">
        <BicycleCard :bicycle="selectedBicycle" :is_list_element="false" />
      </Modal>
  
      <Modal v-if="showClientModal" @close="closeModal">
        <ClientCard :id="selectedClientId" />
      </Modal>
  
      <!-- Modal de confirmation de suppression -->
      <Modal v-if="showDeleteModal" @close="closeModal">
        <h2>Confirmer la suppression</h2>
        <p>Voulez-vous vraiment supprimer cette location ? Cette action est irréversible.</p>
        <div class="modal-buttons">
          <button @click="closeModal">Annuler</button>
          <button @click="confirmDelete">Oui, supprimer</button>
        </div>
      </Modal>
  
      <!-- Modal d'édition des dates et paiement -->
      <Modal v-if="showEditModal" @close="closeModal">
        <h2>Modifier les détails de la location</h2>
        <form @submit.prevent="confirmEdit">
          <div class="form-group">
          <label for="etat">État de la location :</label>
          <select id="etat" v-model="editEtat" required>
            <option value="En Attente">En Attente</option>
            <option value="En Cours">En Cours</option>
            <option value="Terminée">Terminée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
          <div class="form-group" v-if="location.etat == 'En Attente'">
            <label for="date-debut">Date de début :</label>
            <input
              id="date-debut"
              type="date"
              v-model="editDateDebut"
              required
            />
          </div>
          <div class="form-group" v-if="location.etat != 'Terminée' && location.etat != 'Annulée'">
            <label for="date-fin">Date de fin estimée :</label>
            <input
              id="date-fin"
              type="date"
              v-model="editDateFin"
              required
            />
          </div>
          <div class="form-group">
            <label for="paiement-actuel">Paiement actuel :</label>
            <input
              id="paiement-actuel"
              type="number"
              v-model.number="editPaiementActuel"
              required
            />
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeModal">Annuler</button>
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script>
  import BicycleCard from './commons/BicycleCard.vue';
  import ClientCard from './commons/ClientCard.vue';
  import Modal from './commons/Modal.vue';
  
  export default {
    components: { BicycleCard, ClientCard, Modal },
    props: {
      is_gerant: { type: Boolean, default: false },
      id_client: { type: Number, default: null },
      bicycle_list: { type: Array, required: true },
      id_gerant: { type: Number, default: null }
    },
    data() {
      return {
        locations_list: [],
        showVeloModal: false,
        selectedVeloId: null,
        showClientModal: false,
        selectedClientId: null,
        selectedBicycle: null,
        showDeleteModal: false,
        deleteId: null,
        showEditModal: false,
        showOnlyMine: false,
        editLocationData: null,
        editDateDebut: '',
        editDateFin: '',
        editEtat: '',
        editPaiementActuel: 0,
        searchQuery: ''
      };
    },
    computed: {
      filteredLocations() {
        const query = this.searchQuery.toLowerCase();
        return this.locations_list.filter(loc => {
          const nom = loc.nom_client || '';
          const prenom = loc.prenom_client || '';
          const velo = loc.nom_velo || '';
          const matchesSearch =
            nom.toLowerCase().includes(query) ||
            prenom.toLowerCase().includes(query) ||
            velo.toLowerCase().includes(query);
          const matchesGerant = !this.showOnlyMine || loc.id_gerant === this.id_gerant;
          return matchesSearch && matchesGerant;
        });
      }
    },
    async created() {
      await this.fetchLocations();
    },
    methods: {
      async fetchLocations() {
        try {
          let url = '';
          if (this.is_gerant) {
            url = 'http://localhost:3000/location_list/';
          } else if (this.id_client !== null) {
            url = `http://localhost:3000/location_list/client/${this.id_client}`;
          }
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Erreur HTTP : ${res.status}`);
          const data = await res.json();
          if (Array.isArray(data)) this.locations_list = data;
        } catch (err) {
          console.error('Erreur récupération locations :', err);
        }
      },
      formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('fr-FR');
      },
      openVeloModal(location) {
        const bike = this.bicycle_list.find(b => b.id === location.id_velo);
        if (!bike) {
          console.warn(`Vélo introuvable pour l'ID ${location.id_velo}`);
          return;
        }
        this.selectedBicycle = bike;
        this.showVeloModal = true;
      },
      openClientModal(id) {
        this.selectedClientId = id;
        this.showClientModal = true;
      },
      openDeleteModal(id) {
        this.deleteId = id;
        this.showDeleteModal = true;
      },
      async confirmDelete() {
        try {
          await fetch(`http://localhost:3000/location/${this.deleteId}`, { method: 'DELETE' });
          this.closeModal();
          await this.fetchLocations();
        } catch (err) {
          console.error('Erreur suppression :', err);
        }
      },
      openEditModal(location) {
        this.editLocationData = location;
        const toLocalDate = (isoDateStr) => {
          const date = new Date(isoDateStr);
          const offset = date.getTimezoneOffset();
          date.setMinutes(date.getMinutes() - offset);
          return date.toISOString().split('T')[0];
        };
        this.editDateDebut = toLocalDate(location.date_debut);
        this.editDateFin = toLocalDate(location.date_fin_estimee);
        this.editEtat = location.etat;
        this.editPaiementActuel = location.paiement_actuel;
        this.showEditModal = true;
      },
      async confirmEdit() {
        try {
          await fetch(`http://localhost:3000/location/${this.editLocationData.id_location}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date_debut: this.editDateDebut,
              date_fin_estimee: this.editDateFin,
              etat: this.editEtat,
              paiement_actuel: this.editPaiementActuel
            })
          });
          this.closeModal();
          await this.fetchLocations();
        } catch (err) {
          console.error('Erreur modification :', err);
        }
      },
      calculateTotalPrice(location) {
        const debut = new Date(location.date_debut);
        const fin = new Date(location.date_fin_estimee);
        const msInDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.floor((fin - debut) / msInDay) + 1;
        return (location.prix * diffDays).toFixed(2);
      },
      closeModal() {
        this.showVeloModal = false;
        this.showClientModal = false;
        this.showDeleteModal = false;
        this.showEditModal = false;
        this.selectedVeloId = null;
        this.selectedClientId = null;
        this.deleteId = null;
        this.editLocationData = null;
        this.editDateDebut = '';
        this.editDateFin = '';
        this.editEtat = '';
        this.editPaiementActuel = 0;
      }
    }
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
  
  .hoverable:hover {
    background-color: var(--color-soft-blue);
    cursor: pointer;
    transition: background-color 0.3s;
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
  
  .location-actions-header,
  .location-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 0.5rem;
  }
  
  .location-actions button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 1.2rem;
    transition: transform 0.2s;
  }
  
  .location-actions button:hover {
    transform: scale(1.2);
  }
  
  /* Styles modales additionnelles */
  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .modal-buttons button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .modal-buttons button:first-child {
    background-color: var(--color-light-gray);
    color: var(--color-dark-blue);
  }
  
  .modal-buttons button:last-child {
    background-color: var(--color-soft-blue);
    color: white;
  }
  
  .filters {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
  }
  
  .filters input {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--color-dark-blue);
    width: 300px;
  }
  
  .gerant-checkbox {
    margin-left: 20px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    color: var(--color-dark-blue);
  }
  </style>
  