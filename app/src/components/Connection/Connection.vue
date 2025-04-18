<template>
  <div class="login-container">
    <h1 class="title">Se Connecter</h1>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="input-row">
      <label for="email">Email :</label>
      <input id="email" v-model="email" />
    </div>

    <div class="input-row">
      <label for="password">Mot de passe :</label>
      <input id="password" type="password" v-model="password" />
    </div>

    <button class="btn-connection" @click="connection">Se connecter</button>
    <a @click="changePageToInscript" class="link">Créer un compte</a>
    <a @click="changePageToGerant" class="link">Se connecter en tant que Gérant</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "" // pour afficher une erreur
    }
  },
  methods: {
    changePageToGerant() {
      this.$emit('update:change_current_page', 'ConnectionGerant');
    },
    changePageToInscript(){
      this.$emit('update:change_current_page', 'Inscription');
    },
    async connection() {
      this.errorMessage = ""; // Réinitialiser le message d'erreur
      try {
        const response = await fetch("http://localhost:3000/se_connecter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`)
        }

        const json = await response.json()

        if (!json || !json.id_client) {
          this.errorMessage = "Identifiants incorrects.";
          return;
        }

        this.$emit('update:handle_client', true, json.id_client);
        this.$emit('update:change_current_page', 'ListeVelos');
      } catch (error) {
        console.error("Erreur de connexion :", error)
        this.errorMessage = "Erreur lors de la connexion. Veuillez réessayer.";
      }
    }
  },
  emits: ['update:handle_client', 'update:change_current_page']
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: 90px auto 70px;
  padding: 30px;
  background-color: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  gap: 15px;
  font-family: 'Segoe UI', sans-serif;
  color: var(--color-dark-blue);
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.error-message {
  background-color: #ffe5e5;
  color: #c0392b;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 10px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-row label {
  font-weight: 600;
}

.input-row input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.btn-connection {
  background-color: var(--color-soft-blue);
  color: var(--color-beige);
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 16px;
}

.btn-connection:hover {
  background-color: var(--color-dark-blue);
}

.link {
  text-align: center;
  border-radius: 8px;
  font-size: 14px;
  color: var();
  text-decoration: none;
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--color-soft-blue);
  cursor: pointer;
}
</style>
