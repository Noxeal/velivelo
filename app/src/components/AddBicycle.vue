<template>
  <div class="add-bicycle-page">      
    <button class="add-button" @click="showAddModal = true">Ajouter un vélo</button>

    <!-- Modale d'ajout -->
    <Modal v-if="showAddModal" @close="showAddModal = false">
      <h2>Ajouter un nouveau vélo</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Nom du vélo</label>
          <input v-model="bicycle.nom" required />
        </div>
        <div class="form-group">
          <label>Type</label>
          <input v-model="bicycle.type" required />
        </div>
        <div class="form-group">
          <label>État</label>
          <input v-model="bicycle.etat" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <input v-model="bicycle.description" />
        </div>
        <div class="form-group">
          <label>En maintenance ?</label>
          <input type="checkbox" v-model="bicycle.maintenance" />
        </div>

        <!-- Champ conditionnel avec validation -->
        <div class="form-group" v-if="bicycle.maintenance">
          <label>État de maintenance</label>
          <select
            v-model="bicycle.etat_maintenance"
            @change="validateEtatMaintenance"
            class="form-control"
          >
            <option disabled value="">-- Sélectionner un état --</option>
            <option value="En attente de pièce">En attente de pièce</option>
            <option value="En réparation">En réparation</option>
            <option value="Fin de maintenance">Fin de maintenance</option>
          </select>
          <p v-if="etatMaintenanceError" class="error-msg">{{ etatMaintenanceError }}</p>
        </div>

        <div class="form-group">
          <label>Durée de vie (en années)</label>
          <input type="number" v-model="bicycle.duree_de_vie" />
        </div>
        <div class="form-group">
          <label>Cycle de vie</label>
          <input v-model="bicycle.cycle_de_vie" />
        </div>
        <div class="form-group">
          <label>Année de mise en service</label>
          <input type="number" v-model="bicycle.annee_mise_en_service" />
        </div>
        <div class="form-group">
          <label>Prix (€)</label>
          <input type="number" step="0.01" v-model="bicycle.prix" />
        </div>
        <div class="form-group">
          <label>URL de la photo</label>
          <input v-model="bicycle.photo" />
        </div>
        <button type="submit" class="submit-button">Ajouter</button>
      </form>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/commons/Modal.vue';

export default {
  components: {
    Modal
  },
  data() {
    return {
      showAddModal: false,
      bicycle: {
        nom: '',
        type: '',
        etat: '',
        description: '',
        maintenance: false,
        etat_maintenance: '',
        duree_de_vie: '',
        cycle_de_vie: '',
        annee_mise_en_service: '',
        prix: '',
        photo: ''
      },
      etatMaintenanceError: ''
    };
  },
  methods: {
    validateEtatMaintenance() {
      if (this.bicycle.maintenance && !this.bicycle.etat_maintenance.trim()) {
        this.etatMaintenanceError = "L'état de maintenance est requis.";
      } else {
        this.etatMaintenanceError = '';
      }
    },
    async submitForm() {
      this.validateEtatMaintenance();

      if (this.etatMaintenanceError) return;

      try {
        const response = await fetch('http://localhost:3000/velo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.bicycle)
        });

        if (!response.ok) throw new Error('Erreur lors de l’ajout');

        alert('Vélo ajouté avec succès !');
        this.showAddModal = false;

        // Réinitialisation
        this.bicycle = {
          nom: '',
          type: '',
          etat: '',
          description: '',
          maintenance: false,
          etat_maintenance: '',
          duree_de_vie: '',
          cycle_de_vie: '',
          annee_mise_en_service: '',
          prix: '',
          photo: ''
        };
        this.etatMaintenanceError = '';

        this.$emit('bicycle-added');
      } catch (err) {
        console.error(err);
        alert('Échec de l’ajout du vélo.');
      }
    }
  }
};
</script>

<style scoped>
.add-bicycle-page {
  padding: 0.5rem;
  text-align: center;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-dark-blue);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  color: white;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="url"] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.form-group input[type="checkbox"] {
  transform: scale(1.2);
  margin-top: 0.5rem;
}

.submit-button {
  background-color: white;
  color: var(--color-dark-blue);
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.error-msg {
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
