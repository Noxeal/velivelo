<template>
    <div class="clients-list">
      <h1>Liste des clients</h1>

      <div class="filters">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un client..."
        />
        <AddClient @client-added="fetchClients"/>
      </div>

  
      <!-- En-tête -->
      <div class="client-item header">
        <div class="client-col"><p><strong>ID</strong></p></div>
        <div class="client-col"><p><strong>Nom</strong></p></div>
        <div class="client-col"><p><strong>Prénom</strong></p></div>
        <div class="client-col"><p><strong>Email</strong></p></div>
        <div class="client-actions-header"><p><strong>Actions</strong></p></div>
      </div>
  
      <!-- Lignes -->
      <div
        v-for="client in filteredClients"
        :key="client.id"
        class="client-item"
        >

        <div class="client-col">{{ client.id }}</div>
        <div class="client-col">{{ client.nom }}</div>
        <div class="client-col">{{ client.prenom }}</div>
        <div class="client-col">{{ client.email }}</div>
        <div class="client-actions">
          <button @click="openEditModal(client)">✏️</button>
          <button @click="openDeleteModal(client.id)">🗑️</button>
        </div>
      </div>
  
      <div v-if="clients_list.length === 0">
        <p>Aucun client trouvé.</p>
      </div>
      <div v-else>
        <p>Nombre de clients: {{ clients_list.length }}</p>
      </div>
  
      <!-- Modale de suppression -->
      <Modal v-if="showDeleteModal" @close="closeModal">
        <h2>Confirmer la suppression</h2>
        <p>Voulez-vous vraiment supprimer ce client ? Cette action est irréversible.</p>
        <div class="modal-buttons">
          <button @click="closeModal">Annuler</button>
          <button @click="confirmDelete">Oui, supprimer</button>
        </div>
      </Modal>
  
      <!-- Modale d'édition -->
      <Modal v-if="showEditModal" @close="closeModal">
        <h2>Modifier le client</h2>
        <form @submit.prevent="confirmEdit">
          <div class="form-group">
            <label>Nom :</label>
            <input v-model="editNom" required />
          </div>
          <div class="form-group">
            <label>Prénom :</label>
            <input v-model="editPrenom" required />
          </div>
          <div class="form-group">
            <label>Email :</label>
            <input v-model="editEmail" type="email" required />
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
  import AddClient from './AddClient.vue';
  import Modal from './commons/Modal.vue';
  
  export default {
    components: { AddClient, Modal },
    data() {
      return {
        clients_list: [],
        showDeleteModal: false,
        deleteId: null,
        showEditModal: false,
        editClientData: null,
        editNom: '',
        editPrenom: '',
        editEmail: '',
        editTelephone: '',
        searchQuery: ''
      };
    },
    computed: {
        filteredClients() {
            const query = this.searchQuery.toLowerCase();
            return this.clients_list.filter(client =>
            client.nom.toLowerCase().includes(query) ||
            client.prenom.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query)
            );
        }
    },
    async created() {
      await this.fetchClients();
    },
    methods: {
      async fetchClients() {
        try {
          const res = await fetch('http://localhost:3000/client/');
          const data = await res.json();
          if (Array.isArray(data)) this.clients_list = data;
        } catch (err) {
          console.error('Erreur récupération clients :', err);
        }
      },
      openDeleteModal(id) {
        this.deleteId = id;
        this.showDeleteModal = true;
      },
      async confirmDelete() {
        try {
          await fetch(`http://localhost:3000/client/${this.deleteId}`, {
            method: 'DELETE'
          });
          this.closeModal();
          await this.fetchClients();
        } catch (err) {
          console.error('Erreur suppression client :', err);
        }
      },
      openEditModal(client) {
        this.editClientData = client;
        this.editNom = client.nom;
        this.editPrenom = client.prenom;
        this.editEmail = client.email;
        this.showEditModal = true;
      },
      async confirmEdit() {
        try {
          await fetch(`http://localhost:3000/client/${this.editClientData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nom: this.editNom,
              prenom: this.editPrenom,
              email: this.editEmail,
            })
          });
          this.closeModal();
          await this.fetchClients();
        } catch (err) {
          console.error('Erreur modification client :', err);
        }
      },
      closeModal() {
        this.showDeleteModal = false;
        this.showEditModal = false;
        this.deleteId = null;
        this.editClientData = null;
        this.editNom = '';
        this.editPrenom = '';
        this.editEmail = '';
        this.editTelephone = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .clients-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: var(--color-dark-blue);
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
  }
  
  .client-item {
    display: flex;
    align-items: center;
    background-color: var(--color-pink);
    padding: 1rem;
    border-radius: 8px;
    gap: 10px;
  }
  
  .client-col {
    flex: 1;
    padding: 0.5rem;
    text-align: center;
  }
  
  .header {
    font-weight: bold;
    background-color: var(--color-dark-blue);
    color: white;
  }
  
  .client-actions-header,
  .client-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .client-actions button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 1.2rem;
    transition: transform 0.2s;
  }
  
  .client-actions button:hover {
    transform: scale(1.2);
  }
  
  h1 {
    text-align: center;
    font-size: 24px;
    color: var(--color-dark-blue);
  }
  
  /* Modal styles */
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

  </style>
  