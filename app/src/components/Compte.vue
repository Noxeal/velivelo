<script>
export default {
  name: "PageCompte",
  props: {
        id_client: {
            type: Number,
            required: true
        }
    },
  data() {
    return {
      user: null,
      editedUser: {},
      isEditing: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  async created() {
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        console.log(this.id_client);
        const response = await fetch(`http://localhost:3000/client/${this.id_client}`);
        console.log("I hope you die in a fire");
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        this.user = data;
        this.user.old_password = '';
        this.user.mot_de_passe = '';
        this.editedUser = {
        ...data,
        old_password: '',
        mot_de_passe: ''
        };
      } catch (error) {
        console.error("Erreur lors de la récupération du compte :", error);
        this.errorMessage = "Impossible de charger les données.";
      }
    },
    toggleEdit() {
      if (this.isEditing) {
        this.editedUser = { ...this.user };
      }
      this.isEditing = !this.isEditing;
    },
    async saveChanges() {
      try {
        console.log("Mot de passe actuel :", this.editedUser.old_password);
        const response = await fetch(`http://localhost:3000/client/${this.id_client}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...this.editedUser,
            old_password: this.editedUser.old_password
        })
        });

        if (!response.ok) {
            console.log("Whsitle");
          const msg = await response.text();
          this.errorMessage = msg || 'Erreur lors de la mise à jour';
        } else {
            console.log("Mario");
          this.user = { ...this.editedUser };
          this.isEditing = false;
          this.successMessage = 'Modifications enregistrées !';
          this.errorMessage = '';
        }
      } catch (err) {
        this.errorMessage = 'Erreur lors de la sauvegarde.';
      }
    }
  }
};
</script>

<template>
  <div class="mon-compte" v-if="user">
    <h1>Mon Compte</h1>

    <div class="champ">
      <label>Email :</label>
      <p v-if="!isEditing">{{ user.email }}</p>
      <input v-else v-model="editedUser.email" type="email" />
    </div>

    <div class="champ">
      <label>Prénom :</label>
      <p v-if="!isEditing">{{ user.prenom }}</p>
      <input v-else v-model="editedUser.prenom" type="text" />
    </div>

    <div class="champ">
      <label>Nom :</label>
      <p v-if="!isEditing">{{ user.nom }}</p>
      <input v-else v-model="editedUser.nom" type="text" />
    </div>

    <div class="champ" v-if="isEditing">
    <label>Mot de passe actuel :</label>
    <input v-model="editedUser.old_password" type="password" autocomplete="new-password"/>
    </div>

    <div class="champ" v-if="isEditing">
    <label>Nouveau mot de passe :</label>
    <input v-model="editedUser.mot_de_passe" type="password" autocomplete="new-password"/>
    </div>

    <div class="messages">
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>

    <button v-if="!isEditing" @click="toggleEdit">Modifier</button>
    <button v-else @click="saveChanges">Enregistrer</button>
  </div>

  <div v-else class="loading">Chargement du compte...</div>
</template>

<style scoped>
.mon-compte {
  max-width: 500px;
  margin: 80px auto;
  padding: 30px;
  background: #f2f2f2;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
}
.champ {
  margin-bottom: 20px;
}
label {
  font-weight: bold;
}
input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
button {
  padding: 10px 20px;
  background: var(--color-soft-blue);
  color: var(--color-beige);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: var(--color-dark-blue);
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
