<script setup>
import Connection from './components/Connection.vue'
import NavBar from './components/commons/NavBar.vue'
</script>

<template>
  <header>
    <NavBar current_page="Compte" :is_gerant=false :est_connecte=false></NavBar>
  </header>

  <main>
    <Connection/>
  </main>
</template>

<style scoped>
</style>
