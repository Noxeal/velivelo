<script setup>
import { ref, onMounted } from 'vue'
import Connection from './components/Connection/Connection.vue'
import NavBar from './components/commons/NavBar.vue'
import ConnectionGerant from './components/Connection/ConnectionGerant.vue'
import Inscription from './components/Connection/Inscription.vue'
import BicycleCard from './components/commons/BicycleCard.vue'
import Louer from './components/Louer.vue'
import BicycleList from './components/BicycleList.vue'
import LocationsList from './components/LocationsList.vue'
import ClientsList from './components/ClientsList.vue'
import Compte from './components/Compte.vue'

const is_connected = ref(false)
const is_gerant = ref(false)
const id_client = ref(null);
const id_gerant = ref(null);
const page = ref('ListeVelos');
const id_velo = ref(3);
const bicycleList = ref([])

const fetchBicycles = async () => {
  try {
    const response = await fetch('http://localhost:3000/velo')
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`)
    }
    const data = await response.json()
    if (Array.isArray(data)) {
      bicycleList.value = data
    } else {
      console.warn('Les données reçues ne sont pas un tableau :', data)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des vélos :', error)
  }
};

onMounted(async () => {
  fetchBicycles();
})

const reloadBicycles = () => {
  bicycleList.data = [];
  fetchBicycles();
};

const change_current_page = (newPage) => {
  page.value = newPage;
}

const handle_client = (bool, val) => {
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
    <NavBar current_page=page :is_gerant=is_gerant :is_connected=is_connected @update:change_current_page="change_current_page" @update:handle_client="handle_client" @update:handle_gerant="handle_gerant" ></NavBar>
  </header>

  <main>
    <Inscription v-if="page == 'Inscription'" @update:handle_client="handle_client" 
    @update:change_current_page="change_current_page" />
    <Connection v-if="page == 'Connection'" @update:handle_client="handle_client" 
    @update:change_current_page="change_current_page"/>
    <Louer @update:change_current_page="change_current_page" :id_client=id_client :is_gerant="is_gerant" :id_gerant="id_gerant" v-if="page == 'Louer'"/>
    <ConnectionGerant v-if="page == 'ConnectionGerant'" @update:handle_gerant="handle_gerant" 
    @update:change_current_page="change_current_page"/>
    <BicycleList v-if="page == 'ListeVelos'" :bicycle_list="bicycleList" @reload-bicycle-list="reloadBicycles" :is_gerant="is_gerant"/>
    <!-- <LocationsList v-if="page == 'ListeLocations'"></LocationsList> -->
    <!-- Liste des locations, soit en tant que gérant soit en tant que client avec son id -->
    <LocationsList v-if="page == 'ListeLocations'" :id_client="id_client" :is_gerant="is_gerant" :bicycle_list="bicycleList"/>
    <ClientsList v-if="page == 'ListeClients'"></ClientsList>
    <Compte v-if="page == 'Compte'" :id_client=id_client :id_gerant= id_gerant :is_gerant=is_gerant
    @update:change_current_page="change_current_page"/>
  </main>
</template>

<style>
</style>