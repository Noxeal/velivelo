<template>
  <div>
    <div class="email_row">
      <label for="email">Email : </label>
      <input id="email" v-model="email" />
    </div>
    <div class="password_row">
      <label for="password">Mot de passe : </label>
      <input id="password" type="password" v-model="password"/>
    </div>
    <button @click="connection">Se connecter</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async connection() {
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
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const json = await response.json();
        console.log("Réponse du serveur :", json);
      } catch (error) {
        console.error("Erreur de connexion :", error);
      }
    }
  }
};
</script>

<style>
.email_row,
.password_row {
  margin-bottom: 10px;
}
</style>
