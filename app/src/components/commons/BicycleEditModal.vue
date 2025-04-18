<template>
    <Modal @close="$emit('close')">
      <h2>Modifier le vélo</h2>
      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label>Nom</label>
          <input v-model="localBicycle.nom" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <input v-model="localBicycle.description" />
        </div>
        <div class="form-group">
          <label>État</label>
          <input v-model="localBicycle.etat" />
        </div>
        <div class="form-group">
          <label>Maintenance</label>
          <input type="checkbox" v-model="localBicycle.maintenance" />
        </div>
        <div v-if="localBicycle.maintenance" class="form-group">
          <label>État de maintenance</label>
          <select v-model="localBicycle.etat_maintenance" class="form-control">
            <option disabled value="">-- Sélectionner un état --</option>
            <option value="En attente de pièce">En attente de pièce</option>
            <option value="En réparation">En réparation</option>
            <option value="Fin de maintenance">Fin de maintenance</option>
          </select>
        </div>
        <div class="form-group">
          <label>Type</label>
          <input v-model="localBicycle.type" />
        </div>
        <div class="form-group">
          <label>Année de mise en service</label>
          <input type="number" v-model="localBicycle.annee_mise_en_service" />
        </div>
        <div class="form-group">
          <label>Photo (nom de fichier)</label>
          <input v-model="localBicycle.photo" />
        </div>
        <button type="submit" class="submit-button">Enregistrer</button>
      </form>
    </Modal>
  </template>
  
  <script>
  import Modal from '@/components/commons/Modal.vue';
  
  export default {
    components: { Modal },
    props: {
      bicycle: Object
    },
    emits: ['close', 'update-complete'],
    data() {
      return {
        localBicycle: JSON.parse(JSON.stringify(this.bicycle))
      };
    },
    methods: {
      async submitUpdate() {
        try {
          const response = await fetch(`http://localhost:3000/velo/${this.localBicycle.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.localBicycle)
          });
          if (!response.ok) throw new Error('Erreur lors de la mise à jour');
          alert('Vélo mis à jour avec succès !');
          this.$emit('update-complete');
          this.$emit('close');
        } catch (error) {
          console.error('Erreur de mise à jour :', error);
          alert('Échec de la mise à jour.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Reprend tes styles initiaux */
  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.3rem;
    color: white;
  }
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.4rem;
    border-radius: 5px;
    border: 1px solid #ccc;
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
  </style>
  