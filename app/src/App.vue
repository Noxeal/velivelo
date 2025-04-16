<script setup>
import { ref } from 'vue'
import Connection from './components/Connection.vue'
import NavBar from './components/commons/NavBar.vue'
import ConnectionGerant from './components/ConnectionGerant.vue'
import BicycleCard from './components/commons/BicycleCard.vue'
import BicycleList from './components/BicycleList.vue'

const is_connected = ref(false)
const is_gerant = ref(false)
const id_client = ref(null);
const id_gerant = ref(null);
const page = ref('Connection');
const id_velo = ref(3);

const change_current_page = (newPage) => {
  page.value = newPage;
}

const handle_client = (bool, val) => {
  console.log("handleConnection");
  is_connected.value = bool;
  id_client.value = val;
}

const handle_gerant = (bool, val) => {
  is_gerant.value = bool;
  is_connected.value = bool;
  id_gerant.value = val;
}

</script>

<template>
  <header>
    <NavBar current_page=page :is_gerant=is_gerant :is_connected=is_connected @update:change_current_page="change_current_page"></NavBar>
  </header>

  <main>
    <Connection v-if="page == 'Connection'" @update:handle_client="handle_client" 
    @update:change_current_page="change_current_page"/>
    <ConnectionGerant v-if="page == 'ConnectionGerant'" @update:handle_gerant="handle_gerant" 
    @update:change_current_page="change_current_page"/>
    <BicycleList v-if="page == 'ListeVelos'"></BicycleList>
  </main>
</template>

<style scoped>
</style>
