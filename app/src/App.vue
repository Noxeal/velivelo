<script setup>
import { ref } from 'vue'
import Connection from './components/Connection.vue'
import NavBar from './components/commons/NavBar.vue'
import BicycleInfos from './components/BicycleInfos.vue'

const estConnecte = ref(false)
const isGerant = ref(false)
const idClient = ref(null);
const idGerant = ref(null);
const page = ref('Connection');

const changeCurrentPage = (newPage) => {
  page.value = newPage;
}

const handleConnecte = (bool, val) => {
  console.log("handleConnection");
  estConnecte.value = bool;
  idClient.value = val;
}

const handleGerant = (bool, val) => {
  isGerant.value = bool;
  idGerant.value = val;
}

</script>

<template>
  <header>
    <NavBar current_page=page :is_gerant=isGerant :est_connecte=estConnecte @update:changeCurrentPage="changeCurrentPage"></NavBar>
  </header>

  <main>
    <Connection v-if="page == 'Connection'" @update:estConnecte="handleConnecte" 
    @update:isGerant="handleGerant" @update:changeCurrentPage="changeCurrentPage"/>
    <BicycleInfos :id="3"></BicycleInfos>
  </main>
</template>

<style scoped>
</style>
