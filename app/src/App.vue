<script setup>
import { ref } from 'vue'
import Connection from './components/Connection/Connection.vue'
import NavBar from './components/commons/NavBar.vue'
import ConnectionGerant from './components/Connection/ConnectionGerant.vue'
import Inscription from './components/Connection/Inscription.vue'
import BicycleCard from './components/commons/BicycleCard.vue'
import Louer from './components/Connection/Louer.vue'
import BicycleList from './components/BicycleList.vue'
import LocationsList from './components/LocationsList.vue'
import ClientsList from './components/ClientsList.vue'
import Compte from './components/Compte.vue'

const is_connected = ref(false)
const is_gerant = ref(false)
const id_client = ref(null);
const id_gerant = ref(null);
const page = ref('Compte');
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
    <Inscription v-if="page == 'Inscription'" @update:handle_client="handle_client" 
    @update:change_current_page="change_current_page" />
    <Compte v-if="page == 'Compte'" :id_client=id_client
    @update:change_current_page="change_current_page"/>
    <Connection v-if="page == 'Connection'" @update:handle_client="handle_client" 
    @update:change_current_page="change_current_page"/>
    <Louer v-if="page == 'Louer'"/>
    <ConnectionGerant v-if="page == 'ConnectionGerant'" @update:handle_gerant="handle_gerant" 
    @update:change_current_page="change_current_page"/>
    <BicycleList v-if="page == 'ListeVelos'"></BicycleList>
    <LocationsList v-if="page == 'ListeLocations'"></LocationsList>
    <ClientsList v-if="page == 'ListeClients'"></ClientsList>
  </main>
</template>

<style scoped>
</style>
