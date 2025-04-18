<template>
  <div :class="['bicycle-infos', { selected: selected }]">
    <div class="bicycle-card-container">
      <div class="bicycle-basic-card">
        <div class="photo">
          <img :src="photoUrl" alt="Photo du vélo" v-if="bicycle.photo" />
        </div>
        <div class="details">
          <h2>{{ bicycle.nom }}</h2>
          <p v-if="!is_list_element">{{ bicycle.description }}</p>
          <p><strong>État :</strong> {{ bicycle.etat }}</p>
          <p v-if="!is_list_element"><strong>Type :</strong> {{ bicycle.type }}</p>
          <p><strong>Année de mise en service :</strong> {{ bicycle.annee_mise_en_service }}</p>

          <button v-if="can_modify" class="update-button" @click.stop="showUpdateModal = true">
            Modifier
          </button>
          <button v-if="can_modify && is_gerant" class="update-button" @click.stop="confirmDelete">
            Supprimer
          </button>
        </div>
      </div>

      <!-- Maintenance -->
      <div class="maintenance-status" v-if="!is_list_element && bicycle.maintenance">
        <p><strong>État de maintenance :</strong></p>
        <div class="maintenance-dots">
          <span
            v-for="i in 3"
            :key="i"
            :class="['dot', i <= maintenanceLevel() ? maintenanceColorClass() : '']"
          >
            {{ getMaintenanceIcon(i) }}
          </span>
        </div>
        <p class="maintenance-label">{{ bicycle.etat_maintenance }}</p>
      </div>
    </div>

    <BicycleEditModal
      v-if="showUpdateModal"
      :bicycle="bicycle"
      @close="closeAllModals()"
      @update-complete="$emit('update-complete')"
    />
  </div>
</template>

<script>
import Modal from '@/components/commons/Modal.vue';
import BicycleEditModal from '@/components/commons/BicycleEditModal.vue';

export default {
  components: { Modal, BicycleEditModal },
  props: {
    bicycle: Object,
    is_list_element: Boolean,
    selected: Boolean,
    can_modify: Boolean,
    is_gerant: Boolean
  },
  emits: ['update-complete'],
  data() {
    return {
      showUpdateModal: false,
      imagesFolder: import.meta.env.VITE_IMAGES_FOLDER
    };
  },
  computed: {
    photoUrl() {
      return this.bicycle.photo ? `${this.imagesFolder}/${this.bicycle.photo}` : '';
    }
  },
  methods: {
    closeAllModals(){
      this.showUpdateModal = false;
      this.$emit('bicycle-deleted');
    },
    async confirmDelete() {
      if (!this.bicycle.id) return;
      if (!confirm('Voulez-vous vraiment supprimer ce vélo ?')) return;

      try {
        const response = await fetch(`http://localhost:3000/velo/${this.bicycle.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          alert(`Erreur : ${errorMessage}`);
          return;
        }
        this.$emit('bicycle-deleted');
      } catch (err) {
        console.error('Erreur suppression vélo :', err);
        alert('Échec de la suppression du vélo.');
      }
    },

    async updateBicycle() {
      try {
        const response = await fetch(`http://localhost:3000/velo/${this.bicycle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.bicycle)
        });

        if (!response.ok) throw new Error('Erreur lors de la mise à jour');

        alert('Vélo mis à jour avec succès !');
        this.$emit('update-complete');
        this.showUpdateModal = false;
      } catch (error) {
        console.error('Erreur de mise à jour :', error);
        alert('Échec de la mise à jour.');
      }
    },

    maintenanceLevel() {
      const etat = this.bicycle.etat_maintenance?.toLowerCase();
      switch (etat) {
        case 'en attente de pièce':
          return 1;
        case 'en réparation':
          return 2;
        case 'fin de maintenance':
          return 3;
        default:
          return 0;
      }
    },

    maintenanceColorClass() {
      const etat = this.bicycle.etat_maintenance?.toLowerCase();
      switch (etat) {
        case 'en attente de pièce':
          return 'dot-1';
        case 'en réparation':
          return 'dot-2';
        case 'fin de maintenance':
          return 'dot-3';
        default:
          return '';
      }
    },

    getMaintenanceIcon(index) {
      if (index === 1) return '🔧';
      if (index === 2) return '🛠';
      if (index === 3) return '✅';
      return '';
    }
  }
};
</script>

<style scoped>
.bicycle-infos {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background-color: var(--color-dark-blue);
  color: white;
  padding: 2rem;
  border-radius: 8px;
}

.bicycle-infos.selected {
  background-color: var(--color-soft-blue);
  outline: 5px solid var(--color-pink);
}

.photo img {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}

.details {
  flex: 1;
}

.details h2 {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.details p {
  margin: 5px 0;
}

.update-button,
.delete-button {
  margin-top: 1rem;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.update-button {
  background-color: white;
  color: var(--color-dark-blue);
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  margin-left: 10px;
}

.bicycle-card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.bicycle-basic-card {
  display: flex;
  gap: 20px;
  background-color: var(--color-dark-blue);
  color: white;
}

.maintenance-status {
  margin-top: 1rem;
}

.maintenance-dots {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 0.5rem 0;
}

.dot {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: transparent;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-1 {
  background-color: var(--color-pink);
}

.dot-2 {
  background-color: var(--color-yellow);
}

.dot-3 {
  background-color: var(--color-soft-blue);
}

.maintenance-label {
  font-size: 0.9rem;
  color: #ccc;
  text-align: center;
  margin-top: 0.5rem;
}
</style>
