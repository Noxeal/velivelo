<template>
    <div :class="['bicycle-infos', { selected: selected }]">
      <div class="photo">
        <img :src="photoUrl" alt="Photo du vélo" v-if="bicycle.photo" />
      </div>
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
                    <button v-if="can_modify" class="update-button" @click.stop="showUpdateModal = true">Modifier</button>
                </div>
            </div>

            <div class="maintenance-details" v-if="!is_list_element">
                <p v-if="bicycle.maintenance"><strong>Maintenance :</strong> {{ bicycle.etat_maintenance }}</p>
                <p v-if="bicycle.maintenance"><strong>État de maintenance :</strong> {{ bicycle.etat_maintenance }}</p>
            </div>
        </div>
      <!-- Modale de mise à jour -->
      <BicycleEditModal
        v-if="showUpdateModal"
        :bicycle="bicycle"
        @close="showUpdateModal = false"
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

/* .bicycle-infos:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
    cursor: pointer;
} */

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

.update-button {
    margin-top: 1rem;
    background-color: white;
    color: var(--color-dark-blue);
    padding: 0.4rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.submit-button {
    margin-top: 1rem;
    background-color: var(--color-pink);
    color: white;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.3rem;
    color: white;
}

.form-group input {
    width: 100%;
    padding: 0.4rem;
    border-radius: 5px;
    border: 1px solid #ccc;
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
    color: white;}
</style>
