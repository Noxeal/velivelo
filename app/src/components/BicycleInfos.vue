<template>
    <div class="bicycle-infos">
        <div class="photo">
            <img :src="photoUrl" alt="Photo du vélo" v-if="bicycle.photo" />
        </div>
        <div class="details">
            <h2>{{ bicycle.nom }}</h2>
            <p><strong></strong> {{ bicycle.description }}</p>
            <p><strong>État :</strong> {{ bicycle.etat }}</p>
            <p><strong>Type :</strong> {{ bicycle.type }}</p>
            <p><strong>Année de mise en service :</strong> {{ bicycle.annee_mise_en_service }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            bicycle: {},
            imagesFolder: import.meta.env.VITE_IMAGES_FOLDER
        };
    },
    computed: {
        photoUrl() {
            return this.bicycle.photo ? `${this.imagesFolder}/${this.bicycle.photo}` : '';
        }
    },
    async created() {
        await this.fetchBicycle();
    },
    methods: {
        async fetchBicycle() {
            try {
                const response = await fetch(`http://localhost:3000/velo/${this.id}`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                this.bicycle = await response.json();
                console.log("Données du vélo :", this.bicycle);
                console.log("URL de la photo :", this.photoUrl);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        }
    }
};
</script>


<style scoped>
.bicycle-infos {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    background-color: var(--color-dark-blue);
    color: white;
    padding: 2rem;
    border-radius: 8px;
}

.photo img {
    max-width: 200px;
    border-radius: 8px;
}

.details {
    flex: 1;
}

.details h2 {
    margin-bottom: 10px;
}

.details p {
    margin: 5px 0;
}
</style>
