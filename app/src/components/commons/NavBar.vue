<script>
export default {
  props: {
    current_page: {
      type: String,
      required: true
    },
    is_gerant: {
      type: Boolean,
      required: true
    },
    is_connected: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:change_current_page'],
  data() {
    return {
      disconnected_all_pages: [
        { component: 'ListeVelos', label: 'Liste des vélos', gerant_only: false},
      ],

      all_pages: [
        { component: 'Louer', label: 'Louer', gerant_only: false },
        { component: 'ListeLocations', label: 'Liste des locations', gerant_only: false },
        { component: 'ListeVelos', label: 'Liste des vélos', gerant_only: false},
        { component: 'ListeClients', label: 'Liste des clients', gerant_only: true }
      ],
      account_pages: [
        { component: 'Compte', label: '../../../public/images/LogoCompteRose.png', gerant_only: false },
        { component: 'Deconnexion', label: '../../../public/images/deconnexion_rose.png', gerant_only: false }
      ],
      disconnected_pages: [
        { component: 'Connection', label: 'Se connecter', gerant_only: false }
      ]
    }
  },
  methods: {
    changePage(page) {
      this.$emit('update:change_current_page', page)
    },
    isImage(label) {
      return typeof label === 'string' && (label.endsWith('.png') || label.endsWith('.jpg') || label.endsWith('.jpeg') || label.endsWith('.svg') || label.endsWith('.gif'));
    }
}

}
</script>

<template>
  <nav>

    <!-- Logo du site -->

    <div class="logo">
      <img src="../../../public/images/LogoSiteBase.png" alt="Logo" />
    </div>

    <div class="buttons_pages" v-if="is_connected">
      <button 
        v-for="page in all_pages" 
        :key="page.component"
        v-show="is_gerant || !page.gerant_only" 
        :class="current_page === page.component ? 'active' : ''"
        @click="changePage(page.component)"
      >
        {{ page.label }}
      </button>
    </div>

    <div class="buttons_pages" v-else>
      <button 
        v-for="page in disconnected_all_pages" 
        :key="page.component"
        v-show="is_gerant || !page.gerant_only" 
        :class="current_page === page.component ? 'active' : ''"
        @click="changePage(page.component)"
      >
      <span v-if="!isImage(page.label)">
        {{ page.label }}
      </span>
      <img v-else :src="page.label" alt="icone" class="nav-icon" />

      </button>
    </div>

    <div class="buttons_account" v-if="is_connected">
      <button 
        v-for="page in account_pages" 
        :key="page.component"
        v-show="is_gerant || !page.gerant_only" 
        :class="current_page === page.component ? 'active' : ''"
        @click="changePage(page.component)"
      >
      <span v-if="!isImage(page.label)">
        {{ page.label }}
      </span>
      <img v-else :src="page.label" alt="icone" class="nav-icon" />

      </button>
    </div>

    <div class="buttons_account" v-else>
      <button 
        v-for="page in disconnected_pages" 
        :key="page.component"
        v-show="is_gerant || !page.gerant_only" 
        :class="current_page === page.component ? 'active' : ''"
        @click="changePage(page.component)"
      >
      <span v-if="!isImage(page.label)">
        {{ page.label }}
      </span>
      <img v-else :src="page.label" alt="icone" class="nav-icon" />

      </button>
    </div>
  </nav>
</template>

  

<style scoped>

nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-dark-blue);
}

button {
  padding: 2rem 4rem;
  /* Pas de background */
  background: none;
  border: none;
  color : var(--color-pink);
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: var(--color-pink);
  color: var(--color-dark-blue);
}

.active{
    color: var(--color-yellow);
    background-color: #008F88;
}

.logo {
  margin-left: 2rem;
}
.logo img {
  width: 100px;
  height: auto;
}

.nav-icon {
  max-width: 100px;
  max-height: 100px;
}


</style>
