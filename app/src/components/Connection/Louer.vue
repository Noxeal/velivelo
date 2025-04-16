<template>
    <div class="login-container">
      <h1 class="title">Louer</h1>
  
      <div class="input-row">
        <label for="date_debut">Date début :</label>
        <input id="date_debut" type="date" v-model="date_debut" />
      </div>
  
      <div class="input-row">
        <label for="date_fin">Date fin :</label>
        <input id="date_fin" type="date" v-model="date_fin" />
      </div>
  
      <div class="input-row">
        <label for="velo">ID Vélo :</label>
        <input id="velo" v-model="velo" type="number" />
      </div>
  
      <button class="btn-connection" @click="loue">Louer</button>
  
      <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        date_debut: "",
        date_fin: "",
        velo: "",
        message: "",
        success: false
      }
    },
    methods: {
      async loue() {
        try {
          const response = await fetch("http://localhost:3000/louer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              date_debut: this.date_debut,
              date_fin: this.date_fin,
              id_velo: this.velo
            })
          })
  
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(errorText || `Erreur HTTP : ${response.status}`)
          }
  
          const json = await response.json()
          this.message = "Location enregistrée avec succès !"
          this.success = true
  
          // Optionnel : reset des champs
          this.date_debut = ""
          this.date_fin = ""
          this.velo = ""
  
        } catch (error) {
          console.error("Erreur lors de la location :", error)
          this.message = "Erreur lors de la location : " + error.message
          this.success = false
        }
      }
    }
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
  
  p.success {
    color: green;
    text-align: center;
    font-weight: bold;
  }
  
  p.error {
    color: red;
    text-align: center;
    font-weight: bold;
  }
  </style>
  