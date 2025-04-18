<template>
  <div class="add-client-page">      
    <button class="add-button" @click="showAddModal = true">Ajouter un client</button>

    <!-- Modale d'ajout -->
    <Modal v-if="showAddModal" @close="showAddModal = false">
      <h2>Ajouter un nouveau client</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Prénom du client</label>
          <input v-model="client.prenom" required />
        </div>
        <div class="form-group">
          <label>Nom du client</label>
          <input v-model="client.nom" required />
        </div>
        <div class="form-group">
          <label>Email du client</label>
          <input v-model="client.email" required />
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
      client: {
        nom: '',
        prenom: '',
        email: ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3000/profil_client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.client)
        });

        if (!response.ok) throw new Error('Erreur lors de l’ajout');

        alert('Client ajouté avec succès !');
        this.showAddModal = false;

        // Réinitialisation
        this.client = {
            nom: '',
            prenom: '',
            email: ''
        };
        this.etatMaintenanceError = '';

        this.$emit('client-added');
      } catch (err) {
        console.error(err);
        alert('Échec de l’ajout du client.');
      }
    }
  }
};
</script>

<style scoped>
.add-client-page {
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
