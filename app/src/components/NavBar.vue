<script setup>
const props = defineProps({
  current_page: {
    type: String,
    required: true,
  },
  is_gerant: {
    type: Boolean,
    required: true,
  }
})

let all_pages = [
  { component: 'Louer', label: 'Louer', gerant_only: false },
  { component: 'ListeLocations', label: 'Liste des locations', gerant_only: false },
  { component: 'ListeVelos', label: 'Liste des vélos', gerant_only: false },
  { component: 'ListeClients', label: 'Liste des clients', gerant_only: true },
  { component: 'Compte', label: 'Mon Compte', gerant_only: false },
  { component: 'Deconnexion', label: 'Déconnexion', gerant_only: false },
]
</script>

<template>
    <nav>  
      <button v-for="page in all_pages" v-show="is_gerant || !page.gerant_only" :class="current_page === page.component ? 'active' : ''">
            {{ page.label }}
      </button>
    </nav>
  </template>
  

<style scoped>
nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
}
button {
  padding: 2rem 4rem;
}

.active{
    background-color: red;
}
</style>
