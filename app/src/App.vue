<script setup>
import Connection from './components/Connection.vue'
import NavBar from './components/commons/NavBar.vue'
import Inscription from './components/Inscription.vue'
import BicycleInfos from './components/BicycleInfos.vue'
</script>

<template>
  <header>
    <NavBar current_page="Compte" :is_gerant=false :est_connecte=false></NavBar>
  </header>

  <main>
    <Connection/>
    <BicycleInfos :id="3"></BicycleInfos>
  </main>
</template>

<style scoped>
</style>
