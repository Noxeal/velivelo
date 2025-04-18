<template>
  <div class="bicycle-list">
    <h1>Liste des vélos</h1>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher un vélo..."
      />
      <AddBicycle v-if="is_gerant" @bicycle-added="reloadBicycles" />
    </div>

    <div
      v-for="bicycle in filteredBicycles"
      :key="bicycle.id"
      @click="openModal(bicycle)"
      class="bicycle-card-wrapper"
    >
      <BicycleCard
        :bicycle="bicycle"
        :can_modify="false"
        :is_list_element="true"
        @update-complete="reloadBicycles"
      />
    </div>

    <!-- Modale -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">×</button>

        <BicycleCard
          :bicycle="selectedBicycle"
          :can_modify="is_gerant"
          :is_list_element="false"
          :is_gerant="is_gerant"
          @update-complete="reloadBicycles"
          @bicycle-deleted="handleDeletion"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddBicycle from './AddBicycle.vue';
import BicycleCard from './commons/BicycleCard.vue';

export default {
  components: { AddBicycle, BicycleCard },
  props: {
    bicycle_list: Array,
    is_gerant: Boolean
  },
  emits: ["reload-bicycle-list"],
  data() {
    return {
      isModalOpen: false,
      selectedBicycle: null,
      deleteId: null,
      searchQuery: ''
    };
  },
  computed: {
    filteredBicycles() {
      const query = this.searchQuery.toLowerCase();
      return this.bicycle_list.filter(b =>
        (b.nom && b.nom.toLowerCase().includes(query)) ||
        (b.type && b.type.toLowerCase().includes(query)) ||
        (b.etat && b.etat.toLowerCase().includes(query))
      );
    }
  },
  methods: {
    openModal(bicycle) {
      this.selectedBicycle = bicycle;
      this.deleteId = bicycle.id;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedBicycle = null;
      this.deleteId = null;
    },
    reloadBicycles() {
      this.$emit("reload-bicycle-list");
    },
    handleDeletion() {
    this.closeModal();
    this.reloadBicycles();
  }
  }
};
</script>

<style scoped>
.bicycle-list {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100vh;
  gap: 20px;
  padding: 2rem;
  border-radius: 8px;
}

.bicycle-card-wrapper {
  cursor: pointer;
  transition: transform 0.2s;
  width: calc(25% - 20px);
  margin: 10px;
  height: 370px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: var(--color-dark-blue);
  padding: 2rem;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.delete-button {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.filters {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.filters input {
  width: 300px;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-dark-blue);
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
  color: var(--color-dark-blue);
}
</style>
