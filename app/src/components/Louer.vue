<script>
import BicycleCard from './commons/BicycleCard.vue';
import Datepicker from 'vue3-datepicker';

export default {
  components:{
    BicycleCard,
    Datepicker
  },  
  props:{
    id_client:{
      typeof: Number,
      required : true
    }
  },  
  data() {
    return {
      date_debut: null,
      date_fin: null,
      datesBloquees: ["2025-04-20", "2025-04-25", "2025-05-01"],
      bicycleList: "",
      velo: "",
      message: "",
      success: false
    }
  },
  async mounted() {
    try {
      this.fetchVelosDisponibles();
    } catch (error) {
      console.error('Erreur lors de la récupération des vélos :', error)
    }
  },
  watch: {
    async date_debut(newVal) {
      if (this.date_fin){
        if (newVal > this.date_fin) {
          this.date_fin = null
        }
        this.reloadVeloDoublesDate(this.date_debut, this.date_fin);
      }
      else{
        await this.reloadVelo(this.date_fin);
      }
    },
    async date_fin(newVal) {
      if (this.date_debut){
        if(newVal < this.date_debut) {
          this.date_debut = null
        }
        this.reloadVeloDoublesDate(this.date_debut, this.date_fin);
      }
      else{
        await this.reloadVelo(this.date_fin);
      }
    }
  },
  emits: ['update:change_current_page'],
  methods: {
    selectVelo(id) {
      if(this.velo == id){
        this.velo = null;
      }
      else{
        this.velo = id;
      }
    },
    veloExiste(id) {
      return this.bicycleList.some(bicycle => bicycle.id === id);
    },
    async reloadVelo(date){
      const response = await fetch("http://localhost:3000/velos_disponibles/date", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ date: date })
        });
        const data = await response.json()
        if (Array.isArray(data)) {
          this.bicycleList = data
        } else {
          console.warn('Les données reçues ne sont pas un tableau :', data)
        }
        if (!this.veloExiste(this.velo)){
          this.velo = null;
        };
    },
    async reloadVeloDoublesDate(date_debut, date_fin){
      const response = await fetch("http://localhost:3000/velos_disponibles/double_dates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            date_debut: date_debut,
            date_fin: date_fin,
          })
        });
        const data = await response.json()
        if (Array.isArray(data)) {
          this.bicycleList = data
        } else {
          console.warn('Les données reçues ne sont pas un tableau :', data)
        }
        if(!this.veloExiste(this.velo)){
          this.velo = null;
        };
    },
    async fetchVelosDisponibles(){
      const response = await fetch('http://localhost:3000/velos_disponibles')
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        this.bicycleList = data
      } else {
        console.warn('Les données reçues ne sont pas un tableau :', data)
      }
    },
    isDisabled(date) {
      const d = date.toISOString().split("T")[0];
      return this.datesBloquees.includes(d); // ⛔ retourne true pour les dates BLOQUÉES
    },
    async loue() {
      try {
        const response = await fetch("http://localhost:3000/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date_debut: this.date_debut,
            date_fin: this.date_fin,
            id_velo: this.velo,
            id_client: this.id_client
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || `Erreur HTTP : ${response.status}`)
        }

        // Optionnel : reset des champs
        this.date_debut = ""
        this.date_fin = ""
        this.velo = ""
        this.$emit('update:change_current_page', 'ListeVelos');

      } catch (error) {
        console.error("Erreur lors de la location :", error)
        this.message = "Erreur lors de la location : " + error.message
        this.success = false
      }
    }
  }
}
</script>

<template>
  <div class="location-container">
    <h1 class="title">Louer</h1>

    <div class="input-row">
      <label for="date_debut">Date début :</label>
      <Datepicker 
        id="date_debut"
        v-model="date_debut" 
        :disabled-date="isDisabled" 
      />
    </div>

    <div class="input-row">
      <label for="date_fin">Date fin :</label>
      <Datepicker 
        id="date_fin"
        :min="date_debut"
        v-model="date_fin" 
        :disabled-date="isDisabled" 
      />
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <button 
        :disabled="!date_debut || !date_fin || !velo" 
        @click="loue"
        style="padding: 10px 20px; font-size: 16px; background-color: #42b983; color: white; border: none; border-radius: 5px; cursor:pointer"
      > Louer
      </button>
    </div>
    <div class="bicycles-grid">
      <div
        v-for="bicycle in bicycleList"
        :key="bicycle.id"
        @click="selectVelo(bicycle.id)"
        :class="['bicycle-card-wrapper', { selected: velo === bicycle.id }]"
      >
        <BicycleCard :id="bicycle.id" :is_list_element="true" :selected="velo === bicycle.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.location-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  min-height: 100vh;
  margin-top: 70px;
  padding: 30px;
  background-color: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  gap: 15px;
  font-family: 'Segoe UI', sans-serif;
  color: var(--color-dark-blue);
}

.bicycle-card-wrapper.selected{
  border-radius: 10px;
  transform: scale(1.02);
}

.bicycles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-content: center;
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-row label {
  font-weight: 600;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.input-row input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.btn-connection {
  background-color: var(--color-soft-blue);
  color: var(--color-beige);
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 16px;
}

.btn-connection:hover {
  background-color: var(--color-dark-blue);
}

p.success {
  color: green;
  text-align: center;
  font-weight: bold;
}

p.error {
  color: red;
  text-align: center;
  font-weight: bold;
}

.bicycle-card-wrapper {
  cursor: pointer;
  transition: transform 0.2s;
  margin: 10px;
  height: 300px;
}

</style>