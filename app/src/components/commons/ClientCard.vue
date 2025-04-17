<!-- components/commons/ClientCard.vue -->
<template>
    <div v-if="client">
      <h2>{{ client.nom }} {{ client.prenom }}</h2>
      <p><strong>Email :</strong> {{ client.email }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        client: null
      };
    },
    async created() {
      try {
        const response = await fetch(`http://localhost:3000/client/${this.id}`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        this.client = await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération du client :", error);
      }
    }
  };
  </script>
  