<template>
    <div class="bicycle-list">
        <div
            v-for="bicycle in bicycle_list"
            :key="bicycle.id"
            @click="openModal(bicycle.id)"
            class="bicycle-card-wrapper"
            >
        
            <BicycleCard :id="bicycle.id" :is_list_element="true" />
        </div>

        <!-- Modale -->
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <button class="modal-close" @click="closeModal">×</button>
                <BicycleCard :id="selectedBicycleId" :is_list_element="false" />
            </div>
        </div>
        </div>
</template>

  
  <script>
  import BicycleCard from './commons/BicycleCard.vue';
  
  export default {
    components: {
      BicycleCard
    },
    data() {
      return {
        bicycle_list: [],
        isModalOpen: false,
        selectedBicycleId: null
      };
    },
    async created() {
      await this.fetchBicycle();
    },
    methods: {
      async fetchBicycle() {
        try {
          const response = await fetch(`http://localhost:3000/velo/`);
          if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            this.bicycle_list = data;
          } else {
            console.warn("Les données reçues ne sont pas un tableau :", data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
      },
      openModal(bicycleId) {
        this.selectedBicycleId = bicycleId;
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
        this.selectedBicycleId = null;
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
  
  /* Juste pour indiquer le clic */
  .bicycle-card-wrapper {
    cursor: pointer;
    transition: transform 0.2s;
    width: calc(25% - 20px);
    margin: 10px;
    height: 300px;

  }
  
  /* Modale */
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
  </style>
  
  